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
const problem = require("./routes/problem")();
const logger = require("./logger");
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
    origin: "http://localhost:3000", // 프론트 주소
    methods: ["GET", "POST"], // 허용할 methods 종류
  },
});

// 소켓 연결 처리(connection은 연결에 대한 기본 설정)
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); // client ID

  // 프론트에서 socket.emit("join_room", romm) 송신 => 백에서 socket.on()을 통해 받음
  // 백에서도 socket.emit()을 통해 front로 송신 가능
  // join_room = 프론트에서 socket.emit()으로 설정한 변수
  socket.on("join_romm", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // 문제 랜덤으로 뽑아 프론트에 송신
  socket.on("require_answer", (data) => {
    con.query(sql.give_problem, (err, result) => {
      if (err) {
        socket.to(data.room).emit("Error");
      } else {
        socket.to(data.room).emit("결과 보냄", result[0].answer);
      }
    });
  });

  // 다음 순서로 전환 (프론트 코드 나오면 입력)
  socket.on("next-turn", (data) => {});

  socket.on("disconnect", () => {
    console.log("연결 해제", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server Start");
});
