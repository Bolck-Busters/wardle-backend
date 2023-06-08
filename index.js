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
let userNumber = 0;

// 소켓 연결 처리(connection은 연결에 대한 기본 설정)
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // client ID

  // room 하나에 유저 2명만 입장하도록 설정
  socket.on("insert_room", (msg) => {
    // user의 수가 2명이면
    if (userNumber > 1) {
      // room 증가
      roomNumber = roomNumber + 1;
      socket.join(`${roomNumber}`);

      // user 초기화
      userNumber = 0;
    } else {
      // user 수 증가
      socket.join(`${roomNumber}`);
      userNumber = userNumber + 1;
    }
    console.log(`roomNumber ::: ${roomNumber} userNumber ::: ${userNumber}`);
    // 1씩증가
    console.log(`msg::: ${msg.nickname}`);
    socket.join(`${roomNumber}`);
    // socket.join(`some room`);

    console.log(socket.rooms);

    socket.to(msg).emit({ msg: "welcome" });
  });

  // 다음 유저 순서라는 것을 프론트에 알려줌
  socket.on("next_turn", (data) => {
    io.to(socket.id).emit("change_order", { result: true });
  });

  // 프론트에서 socket.emit("join_room", romm) 송신 => 백에서 socket.on()을 통해 받음
  // 백에서도 socket.emit()을 통해 front로 송신 가능
  // join_room = 프론트에서 socket.emit()으로 설정한 변수
  // 프론트에서 유저가 입력한 값이랑 정답을 받음
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
    io.to(_roomId).emit("transfer_result", { result: _result });
  });

  socket.on("disconnect", () => {
    console.log("연결 해제", socket.id);
  });
});

// 포트번호 3000으로 서버 실행
server.listen(3000, () => {
  console.log("Server Start");
});
