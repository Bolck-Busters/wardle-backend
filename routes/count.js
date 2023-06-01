const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

module.exports = function () {
  /**
   * @swagger
   * /count/win:
   *    put:
   *      description: 승리 횟수 +1
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.put("/win/:wallet", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.plus_win, [_wallet], (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    });
  });

  /**
   * @swagger
   * /count/lose:
   *    put:
   *      description: 패배 횟수 +1
   *      response:
   *        200:
   *          description: Sucess
   *
   */
  router.put("/lose/:wallet", (req, res) => {
    const _wallet = req.query.wallet;
    console.log(_wallet);
    con.query(sql.plus_lose, [_wallet], (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    });
  });

  return router;
};
