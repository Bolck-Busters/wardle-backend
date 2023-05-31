const express = require("express");
const app = express();
const mysql = require("mysql2");
const Web3 = require("web3");
const { swaggerUi, specs } = require("./swagger/swagger");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const con = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.db_pass,
  database: process.env.db,
});

// 로그인
app.get("/login", (req, res) => {
  const _wallet = req.body.wallet;
  console.log(_wallet);
  con.query(
    `SELECT nickname FROM user WHERE wallet = ?`,
    [_address],
    (err, result) => {
      if (err) {
        res.send("sql error");
      } else {
        if (result.length != 0) {
          console.log(result[0]["nickname"]);
          res.send({ result: true });
        } else {
          res.send({ result: false });
        }
      }
    }
  );
});

// 로그아웃
app.post("/logout", (req, res) => {});

// 회원가입
app.post("/signup", (req, res) => {
  const _wallet = req.body.wallet;
  const _nickname = req.body.nickname;
  console.log(_wallet, _nickname);
  if (_nickname.length == 0) {
    res.send("닉네임을 입력해주세요");
  }
  con.query(
    `INSERT INTO user (wallet, nickname) VALUES (?, ?)`,
    [_wallet, _nickname],
    (err, result) => {
      if (err) {
        res.send({ result: false });
      } else {
        res.send({ result: true });
      }
    }
  );
});

// 유저 프로필 조회
app.get("/info", (req, res) => {
  const _wallet = req.body.wallet;
  console.log(_wallet);
  con.query(`SELECT * FROM user WHERE wallet = ?`, [_wallet], (err, result) => {
    if (err) {
      res.send({ result: false });
    } else {
      res.send(result[0]);
    }
  });
});

// 회원 탈퇴
app.delete("/withdrawl", (req, res) => {
  const _wallet = req.query.wallet;
  console.log(_wallet);
  con.query(`DELETE FROM user WHERE wallet = ?`, [_wallet], (err, result) => {
    if (err) {
      res.send("");
    } else {
      res.send("");
    }
  });
});

// 승리 횟수 +1
app.put("/win/:wallet", (req, res) => {
  const _wallet = req.params.wallet;
  console.log(_wallet);
  con.query(
    `UPDATE user SET win_count = win_count + 1 WHERE wallet = ?`,
    [_wallet],
    (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    }
  );
});

// 패배 횟수 +1
app.put("/lose", (req, res) => {
  const _wallet = req.query.wallet;
  console.log(_wallet);
  con.query(
    `UPDATE user SET lose_count = lose_count + 1 WHERE wallet = ?`,
    [_wallet],
    (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    }
  );
});

// 티켓 사용
app.put("/use", (req, res) => {
  const _wallet = req.query.wallet;
  const _level = req.query.level;
  console.log(_wallet, _level);
  let _ticket;
  if ((_level = 5)) {
    _ticket = 3;
  } else if ((_level = 6)) {
    _ticket = 4;
  } else {
    _ticket = 5;
  }
  con.query(
    `UPDATE user SET ticket_count = ticket_count - ? WHERE wallet = ?`,
    [_ticket, _wallet],
    (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    }
  );
});

// 티켓 구입
app.put("/buy", (req, res) => {
  const _wallet = req.query.wallet;
  const _count = req.query.count;
  console.log(_wallet, _count);
  con.query(
    `UPDATE user SET ticket_count = ticket_count + ? WHERE wallet = ?`,
    [_count, _wallet],
    (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server Start");
});
