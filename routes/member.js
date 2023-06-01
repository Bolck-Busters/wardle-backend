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
          res.json({ msg: "기존회원입니다.", type: "exist" }); // 기존회원인 경우
        } else {
          res.json({ msg: "신규회원입니다.", type: "new" }); // 신규회원인 경우
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
          console.log(req.session.member_info);
          res.json({ msg: "로그인에 성공하였습니다.", result: true }); // 로그인 성공
        } else {
          res.json({ msg: "로그인에 실패하였습니다.", result: false }); // 로그인 실패
        }
      }
    });
  });

  // 로그아웃
  router.get("/logout", (req, res) => {
    req.session.destroy(); // 세션 제거
    res.json({ state: 0 }); // 로그아웃 상태 (세션 소멸)
  });

  // 회원가입
  router.post("/signup", (req, res) => {
    const _wallet = req.body.wallet;
    const _nickname = req.body.nickname;
    console.log(_wallet, _nickname);
    con.query(sql.signup, [_wallet, _nickname], (err, result) => {
      if (err) {
        res.json({ msg: "회원가입에 실패하였습니다.", result: false }); // 회원가입 실패
      } else {
        res.json({ msg: "회원가입이 완료되었습니다.", result: true }); // 회원가입 성공
      }
    });
  });

  // 회원 탈퇴
  router.delete("/withdrawl", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.withdrawl, [_wallet], (err, result) => {
      if (err) {
        res.json({ msg: "회원탈퇴에 실패하였습니다.", result: false }); // 회원탈퇴 실패
      } else {
        res.json({ msg: "회원탈퇴가 완료되었습니다.", result: true }); // 회원탈퇴 성공
      }
    });
  });

  return router;
};
