const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

module.exports = function () {
  // 신규회원 판별
  router.get("/divide", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.divide, [_wallet], (err, result) => {
      if (err) {
        res.send("sql error");
      } else {
        if (result.length != 0) {
          res.send("new"); // 기존회원인 경우
        } else {
          res.send("exist"); // 신규회원인 경우
        }
      }
    });
  });

  // 로그인
  router.get("/login", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.login, [_wallet], (err, result) => {
      if (err) {
        res.send("sql error");
      } else {
        if (result.length != 0) {
          req.session.member_info = result[0]; // 로그인을 하면 세션에 모든 유저 정보를 저장
          res.json({ result: true }); // 로그인 성공
        } else {
          res.json({ result: false }); // 로그인 실패
        }
      }
    });
  });

  // 로그아웃
  router.get("/logout", (req, res) => {
    req.session.destroy(); // 세션 삭제
    res.json({ state: 0 }); // 로그아웃 상태 (세션 소멸)
  });

  // 회원가입
  router.post("/signup", (req, res) => {
    const _wallet = req.body.wallet;
    const _nickname = req.body.nickname;
    console.log(_wallet, _nickname);
    con.query(sql.signup, [_wallet, _nickname], (err, result) => {
      if (err) {
        res.json({ result: false }); // 회원가입 실패
      } else {
        res.json({ result: true }); // 회원가입 성공
      }
    });
  });

  // 회원 탈퇴
  router.delete("/withdrawl", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.withdrawl, [_wallet], (err, result) => {
      if (err) {
        res.json({ result: false }); // 회원탈퇴 실패
      } else {
        res.json({ result: true }); // 회원탈퇴 성공
      }
    });
  });

  return router;
};
