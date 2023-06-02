const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

/**
 * @swagger
 * tags:
 *   name: count
 *   description: 승리 및 패배 횟수 변경
 */
module.exports = function () {
  /**
   * @swagger
   * /count/win:
   *    put:
   *      tags: [count]
   *      summary: 승리 횟수 +1
   *      parameters:
   *        - in: body
   *          name: wallet
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
  router.put("/win", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.plus_win, [_wallet], (err, result) => {
      if (err) {
        res.json({
          msg: "에러 발생으로 인하여 승리 반영에 실패하였습니다.",
          result: false,
        });
      } else {
        if (result.affectedRows == 1) {
          res.json({ msg: "승리 반영에 성공하였습니다.", result: true });
        } else {
          res.json({ msg: "잘못된 지갑 주소입니다.", result: false });
        }
      }
    });
  });

  /**
   * @swagger
   * /count/lose:
   *    put:
   *      tags: [count]
   *      summary: 패배 횟수 +1
   *      parameters:
   *        - in: body
   *          name: wallet
   *          description: 지갑 주소
   *          required: true
   *          type: string
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
  router.put("/lose", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.plus_lose, [_wallet], (err, result) => {
      if (err) {
        res.json({
          msg: "에러 발생으로 인하여 패배 반영에 실패하였습니다.",
          result: false,
        });
      } else {
        if (result.affectedRows == 1) {
          res.json({ msg: "패배 반영에 성공하였습니다.", result: true });
        } else {
          res.json({ msg: "잘못된 지갑 주소입니다.", result: false });
        }
      }
    });
  });

  return router;
};
