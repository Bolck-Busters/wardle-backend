const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

module.exports = function () {
  // 로그인
  router.get("/login", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.login, [_address], (err, result) => {
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
    });
  });

  // 로그아웃
  router.post("/logout", (req, res) => {});

  // 회원가입
  router.post("/signup", (req, res) => {
    const _wallet = req.body.wallet;
    const _nickname = req.body.nickname;
    console.log(_wallet, _nickname);
    con.query(sql.signup, [_wallet, _nickname], (err, result) => {
      if (err) {
        res.send({ result: false });
      } else {
        res.send({ result: true });
      }
    });
  });

  // 유저 프로필 조회
  router.get("/info", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.check_info, [_wallet], (err, result) => {
      if (err) {
        res.send("SQL Error");
      } else {
        res.send(result[0]);
      }
    });
  });

  // 회원 탈퇴
  router.delete("/withdrawl", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.withdrawl, [_wallet], (err, result) => {
      if (err) {
        res.send({ result: false });
      } else {
        res.send({ result: true });
      }
    });
  });

  return router;
};
