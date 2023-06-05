const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");
const logger = require("../logger");

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
   *    post:
   *      tags: [member]
   *      summary: 회원 구분 (신규 / 기존)
   *      parameters:
   *        - name: wallet
   *          in: body
   *          description: 지갑 주소
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
  router.post("/divide", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.divide, [_wallet], (err, result) => {
      if (err) {
        res.send("SQL 에러 발생");
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
   *   post:
   *     tags: [member]
   *     summary: 로그인
   *     parameters:
   *       - name: wallet
   *         in: body
   *         description: 지갑 주소
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             wallet:
   *               type: string
   *     responses:
   *      200:
   *        description: Sucess
   *        schema:
   *          properties:
   *            msg:
   *              type: string
   *              example: 로그인에 성공하였습니다.
   *            result:
   *              type: boolean
   *              example: true
   *            user_ifo:
   *              type: object
   *              properties:
   *                user_id:
   *                  type: number
   *                  example: 1
   *                wallet:
   *                  type: string
   *                  example: 지갑주소
   *                nickname:
   *                  type: string
   *                  example: 닉네임
   *                win_count:
   *                  type: number
   *                  example: 5
   *                lose_count:
   *                  type: number
   *                  example: 3
   *                ticket_count:
   *                  type: number
   *                  example: 10
   *                reward_ticket:
   *                  type: number
   *                  example: 20
   */
  router.post("/login", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.login, [_wallet], (err, data) => {
      if (err) {
        res.json({
          msg: "에러 발생으로 인하여 로그인에 실패하였습니다.",
          result: false,
        }); // 로그인 실패
      } else {
        if (data.length != 0) {
          // req.session.member_info = data[0]; // 로그인을 하면 세션에 모든 유저 정보를 저장
          console.log(data[0]);
          res.json({
            msg: "로그인에 성공하였습니다.",
            result: true,
            user_info: data[0],
          }); // 로그인 성공
        } else {
          res.json({
            msg: "로그인에 실패하였습니다. (조회된 회원 정보 X)",
            result: false,
          }); // 로그인 실패
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
   *      responses:
   *        200:
   *          description: Sucess
   *          schema:
   *            properties:
   *              msg:
   *                type: string
   *                example: 로그아웃이 완료되었습니다
   *              state:
   *                type: number
   *                example: 0
   */
  router.post("/logout", (req, res) => {
    req.session.destroy(); // 세션 제거
    res.json({ msg: "로그아웃이 완료되었습니다.", state: 0 }); // 로그아웃 상태 (세션 소멸)
  });

  /**
   * @swagger
   * /member/signup:
   *    post:
   *      tags: [member]
   *      summary: 회원가입
   *      parameters:
   *        - name: JSON
   *          in: body
   *          description: 지갑 주소 & 회원 닉네임
   *          required: true
   *          type: string
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *              nickname:
   *                type: string
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
  router.post("/signup", (req, res) => {
    const _wallet = req.body.wallet;
    const _nickname = req.body.nickname;
    console.log(_wallet, _nickname);
    console.log(sql.signup);
    con.query(sql.signup, [_wallet, _nickname, _nickname], (err, result) => {
      if (err) {
        res.json({
          msg: "에러 발생으로 인하여 회원가입에 실패하였습니다.",
          result: false,
        }); // 회원가입 실패
      } else {
        if (result.affectedRows == 0) {
          res.json({ msg: "이미 존재하는 닉네임입니다.", result: false }); // 회원가입 실패 (닉네임 중복)
        } else {
          res.json({ msg: "회원가입이 완료되었습니다.", result: true }); // 회원가입 성공
        }
      }
    });
  });

  /**
   * @swagger
   * /member/withdrawl:
   *    delete:
   *      tags: [member]
   *      summary: 회원탈퇴
   *      parameters:
   *        - name: wallet
   *          in: body
   *          description: 지갑 주소
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
  router.delete("/withdrawl", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.withdrawl, [_wallet], (err, result) => {
      if (err) {
        res.json({
          msg: "에러 발생으로 인하여 회원탈퇴에 실패하였습니다.",
          result: false,
        }); // 회원탈퇴 실패 (에러)
      } else {
        if (result.affectedRows == 0) {
          res.json({ msg: "잘못된 지갑 주소입니다.", result: false }); // 회원탈퇴 실패 (DB에 없는 지갑 주소 입력)
        } else {
          res.json({ msg: "회원탈퇴가 완료되었습니다.", result: true }); // 회원탈퇴 성공
        }
      }
    });
  });

  return router;
};
