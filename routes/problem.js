const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");
const logger = require("../logger");

/**
 * @swagger
 * tags:
 *   name: problem
 *   description: 문제 추첨
 */
module.exports = function () {
  /**
   * @swagger
   * /problem/random:
   *    get:
   *      tags: [problem]
   *      summary: 문제를 랜덤으로 뽑아 전송
   *      parameters:
   *        - name: length
   *          in: query
   *          description: 문자 길이
   *          required: true
   *          type: string
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
  router.get("/random", (req, res) => {
    const _length = req.query.length;
    console.log(_length);
    con.query(sql.give_problem, [_length], (err, result) => {
      if (err) {
        logger.error(
          "글자 길이 : " + _length + ", 에러 메시지 : " + err.sqlMessage
        );
        res.send("SQL 에러 발생");
      } else {
        if (result.length != 0) {
          res.json({
            msg: "문제를 불러오는데 성공하였습니다.",
            word: result[0]["answer"],
            result: true,
          });
        } else {
          res.json({
            msg: "문제를 불러오는데 실패하였습니다.",
            word: "",
            result: false,
          });
        }
      }
    });
  });

  return router;
};
