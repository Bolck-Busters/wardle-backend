const express = require("express");
const app = express();
const session = require("express-session");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const ticket = require("./routes/ticket")();
const count = require("./routes/count")();
const member = require("./routes/member")();
const problem = require("./routes/problem")();
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
app.use("/problem", problem);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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

// 소켓 연결 처리(connection은 연결에 대한 기본 설정)
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // client ID

  // room 하나에 유저 2명만 입장하도록 설정
  socket.on("insert_room", (data) => {
    // 초기값 0
    if (userNumber === 1) {
      //룸 증가시켜
      roomNumber = roomNumber + 1;
      socket.emit("insert_room", {
        roomNum: roomNumber,
        result: "pending",
        userNumber: userNumber,
      });
      // 유저넘버 증가시켜
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
            // res.json({
            //   msg: "문제를 불러오는데 성공하였습니다.",
            //   word: result[0]["answer"],
            //   result: true,
            // });
            console.log(2);
            socket.emit("insert_room", {
              roomNum: roomNumber,
              result: "full",
              userNumber: userNumber,
              value: result[0]["answer"],
            });
          } else {
            // res.json({
            //   msg: "문제를 불러오는데 실패하였습니다.",
            //   word: "",
            //   result: false,
            // });
          }
        }
      });

      userNumber = 1;
    }
    console.log(`room_number ::: ${roomNumber} user_count ::: ${userNumber}`);
    socket.join(`${roomNumber}`);
    // 클라이언트에게 룸번호 알려주기
    socket.emit("insert_room", {
      roomNum: roomNumber,
      result: "success",
    });
  });

  // 다음 유저 순서라는 것을 프론트에 알려줌
  socket.on("next_turn", (data) => {
    io.to(socket.id).emit("change_order", { result: true });
  });

  // 프론트에서 유저가 입력한 값이랑 정답을 받아서 비교 후 결과 반환
  socket.on("send", (data) => {
    const _roomId = data["roomId"];
    const _problem = data["problem"];
    const _answer = data["answer"];
    console.log(_problem, _answer);
    let _result;
    if (_problem === _answer) {
      _result = true;
    } else {
      _result = false;
    }
    socket.to(_roomId).emit("transfer_result", { result: _result });
  });

  socket.on("disconnect", () => {
    console.log("연결 해제", socket.id);
  });
});

// 포트번호 3000으로 서버 실행
server.listen(3000, () => {
  console.log("Server Start");
});
