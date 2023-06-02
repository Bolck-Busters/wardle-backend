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
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *      response:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                    ok:
   *
   *
   */
  router.put("/win", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.plus_win, [_wallet], (err, result) => {
      if (err) {
        res.json({ msg: "승리 반영에 실패하였습니다.", result: false });
      } else {
        res.json({ msg: "승리 반영에 성공하였습니다.", result: true });
      }
    });
  });

  /**
   * @swagger
   * /count/lose:
   *    put:
   *      tags: [count]
   *      summary: 패배 횟수 +1
   *      description: 패배 횟수 +1
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.put("/lose", (req, res) => {
    const _wallet = req.body.wallet;
    console.log(_wallet);
    con.query(sql.plus_lose, [_wallet], (err, result) => {
      if (err) {
        res.json({ msg: "패배 반영에 실패하였습니다.", result: false });
      } else {
        res.json({ msg: "패배 반영에 성공하였습니다.", result: true });
      }
    });
  });

  return router;
};
