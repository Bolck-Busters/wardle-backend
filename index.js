const express = require("express");
const app = express();
const con = require("../mysql");
const Web3 = require("web3");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { swaggerUi, specs } = require("./swagger/swagger");
const ticket = require("./routes/ticket")();
const count = require("./routes/count")();
const member = require("./routes/member")();

const web3 = new Web3(new Web3.providers.HttpProvider("컨트랙트 주소"));
const abi = require("./ABI.json");
const smartContract = new web3.eth.Contract(
  abi,
  "0x4Ff0c28bb08044cF583a3563D4013fB12bdFef1e"
);

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
    con.query(
      `SELECT answer FROM problem ORDER BY rand() LIMIT 1`,
      (err, result) => {
        if (err) {
          socket.to(data.room).emit("Error");
        } else {
          socket.to(data.room).emit("결과 보냄", result[0].answer);
        }
      }
    );
  });

  // 다음 순서로 전환 (프론트 코드 나오면 입력)
  socket.on("next-turn", (data) => {});

  socket.on("disconnect", () => {
    console.log("연결 해제", socket.id);
  });
});

app.use("/ticket", ticket);
app.use("/count", count);
app.use("/member", member);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

server.listen(5000, () => {
  console.log("Server Start");
});
