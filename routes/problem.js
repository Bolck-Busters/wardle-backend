const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

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
   *      summary: 문제 랜덤으로 뽑아 전송
   *      description: 문제 랜덤으로 뽑아 전송
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.get("/random", (req, res) => {
    const _length = req.query.length;
    console.log(_length);
    con.query(sql.give_problem, [_length], (err, result) => {
      if (err) {
        res.send("sql error");
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
