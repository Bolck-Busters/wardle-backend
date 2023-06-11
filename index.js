const express = require("express");
const app = express();
const session = require("express-session");
const con = require("./mysql");
const sql = require("./sql");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const ticket = require("./routes/ticket")();
const count = require("./routes/count")();
const member = require("./routes/member")();
require("dotenv").config();

// cors 설정 (http)
app.use(
  cors({
    origin: "*", // 프론트 주소(마지막에 수정 필수!)
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 세션 세팅(세션 세팅은 app.use를 통해 라우터를 호출하기 이전에 실행되어야 함)
app.use(
  session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000, httpOnly: true }, // 세션쿠키 유효기간 5분
  })
);

// 세션 확인 -> 백에서는 확인한 후 결과를 프론트에 전송하여 상황에 따른 페이지 이동은 프론트에서 처리
app.use("/mode", (req, res) => {
  if (!req.session.member_info) {
    console.log(req.session.member_info);
    res.json({ state: 1 }); // 로그인 상태 (세션 유지)
  } else {
    res.json({ state: 0 }); // 로그아웃 상태 (세션 소멸)
  }
});

// POST 사용 설정 (req.body 사용 가능하게)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router 적용
app.use("/ticket", ticket);
app.use("/count", count);
app.use("/member", member);

// Swagger 설정
const { swaggerUi, specs } = require("./swagger/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Socket 통신 설정
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 프론트 주소
    methods: ["GET", "POST"], // 허용할 methods 종류
  },
});

let roomNumber = 0;
let userNumber = 1;
let pending = true; // 방에 1명만 들어오면 기다려야 하니 pending으로 클라이언트 통신
let answer = {}; // 답 관리 {룸이름: 답이름}
let msg;
let game_result;

// 소켓 연결 처리(connection은 연결에 대한 기본 설정)
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // client ID

  socket.onAny((e) => {
    console.log(`소켓 이벤트: ${e}`);
  });

  // room 하나에 유저 2명만 입장하도록 설정
  socket.on("insert_room", (data) => {
    // 초기값 0
    if (userNumber === 1) {
      //방 번호 증가
      roomNumber = roomNumber + 1;
      socket.emit("insert_room", {
        roomNum: roomNumber,
        result: "success",
        userNumber: userNumber,
      });

      // 대기 현황 업데이트
      pending = true;

      // 유저 넘버 증가
      userNumber = userNumber + 1;
    } else if (userNumber === 2) {
      const _length = data["length"];
      console.log(_length);
      con.query(sql.give_problem, [_length], (err, result) => {
        if (err) {
          console.log(1);
          logger.error(
            "글자 길이 : " + _length + ", 에러 메시지 : " + err.sqlMessage
          );
          res.send("SQL 에러 발생");
        } else {
          if (result.length != 0) {
            console.log("정답 : " + result[0]["answer"]);
            msg = "success";
            answer[`${roomNumber}`] = result[0]["answer"];
          } else {
            msg = "fail";
          }
        }
      });
      socket.emit("insert_room", {
        roomNum: roomNumber,
        result: msg,
        userNumber: userNumber,
      });
      pending = false;
      userNumber = 1;
      console.log(4);
    }

    console.log(roomNumber, userNumber);
    socket.join(`${roomNumber}`);
    console.log(5);
    if (!pending) {
      // 방에 있는 사람들한테 꽉찼다고 보냄
      io.to(String(roomNumber)).emit("pending", {
        result: "success",
        pending: pending,
      });
    }
    console.log(6);
    console.log("socket.rooms: ", socket.rooms); //
  });

  // 턴 관리
  socket.on("turn", (msg) => {
    console.log(msg);
    let turn;
    if (msg.userNum === 1) {
      turn = 2;
    } else {
      turn = 1;
    }
    console.log(turn);
    io.to(msg.roomNum).emit("turn", { userTurn: turn, result: "success" });
  });

  // 답변받기
  socket.on("answer", (msg) => {
    console.log(msg);
    console.log(answer[msg.roomNum]);

    // 룸 방에 있는 정답 값과 유저가 입력한 값이 같을때(서버에 저장되어 있는 값이랑 같을 때)
    if (answer[msg.roomNum] === msg.value) {
      game_result = true;
      // io.to(msg.roomNum).emit("answer", {
      //   result: "success",
      //   gameWin: true,
      //   userNum: msg.userNum,
      // });
    } else {
      game_result = false;
      // io.to(msg.roomNum).emit("answer", {
      //   result: "success",
      //   gameWin: false,
      //   userNum: msg.userNum,
      // });
    }
    io.to(msg.roomNum).emit("answer", {
      result: "success",
      gameWin: game_result,
      userNum: msg.userNum,
    });
  });

  // 채팅방 나가기
  socket.on("leaveRoom", (roomNumber) => {
    io.socketsLeave(roomNumber);
    console.log("socket.rooms: ", socket.rooms); //
  });

  // 소켓 연결 해제
  socket.on("disconnect", () => {
    console.log("연결 해제", socket.id);
  });
});

// 포트번호 3000으로 서버 실행
server.listen(3000, () => {
  console.log("Server Start");
});
