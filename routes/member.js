const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

/**
 * @swagger
 * tags:
 *   name: member
 *   description: 회원 관련
 */
module.exports = function () {
  /**
   * @swagger
   * /member/divide:
   *    put:
   *      tags: [member]
   *      summary: 신규회원 판별
   *      description: 신규회원 판별
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.post("/divide", (req, res) => {
    const _wallet = req.body.wallet;
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

  /**
   * @swagger
   * /member/login:
   *    post:
   *      tags: [member]
   *      summary: 로그인
   *      description: 로그인
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.post("/login", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(sql.login);
    con.query(sql.login, [_wallet], (err, data) => {
      if (err) {
        res.send("sql error");
      } else {
        if (data.length != 0) {
          console.log(data[0]);
          req.session.member_info = data[0]; // 로그인을 하면 세션에 모든 유저 정보를 저장
          console.log(req.session.member_info);
          res.json({ msg: "로그인에 성공하였습니다.", result: true }); // 로그인 성공
        } else {
          res.json({ msg: "로그인에 실패하였습니다.", result: false }); // 로그인 실패
        }
      }
    });
  });

  /**
   * @swagger
   * /member/logout:
   *    post:
   *      tags: [member]
   *      summary: 로그아웃
   *      description: 로그아웃
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.get("/logout", (req, res) => {
    req.session.destroy(); // 세션 제거
    res.json({ msg: "로그아웃이 완료되었습니다.", state: 0 }); // 로그아웃 상태 (세션 소멸)
  });

  /**
   * @swagger
   * /member/signup:
   *    post:
   *      tags: [member]
   *      summary: 회원가입
   *      description: 회원가입
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.post("/signup", (req, res) => {
    const _wallet = req.body.wallet;
    const _nickname = req.body.nickname;
    console.log(_wallet, _nickname);
    console.log(sql.signup);
    con.query(sql.signup, [_wallet, _nickname, _nickname], (err, result) => {
      if (err) {
        res.json({ msg: "회원가입에 실패하였습니다.", result: false }); // 회원가입 실패
      } else {
        if (result.affectedRows == 0) {
          res.json({ msg: "이미 존재하는 닉네임입니다.", result: false }); // 회원가입 실패 (닉네임 중복)
        } else {
          res.json({ msg: "회원가입이 완료되었습니다.", result: true }); // 회원가입 성공
        }
      }
    });
  });

  // 회원 탈퇴
  router.delete("/withdrawl", (req, res) => {
    const _wallet = req.body.wallet;
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
