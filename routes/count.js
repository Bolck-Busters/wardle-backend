const express = require("express");
const router = express.Router();
const con = require("../mysql");

module.exports = function () {
  // 승리 횟수 +1
  router.put("/win/:wallet", (req, res) => {
    const _wallet = req.params.wallet;
    console.log(_wallet);
    con.query(
      `UPDATE user SET win_count = win_count + 1 WHERE wallet = ?`,
      [_wallet],
      (err, result) => {
        if (err) {
          res.send("ERROR");
        } else {
          res.send("정상 처리");
        }
      }
    );
  });

  // 패배 횟수 +1
  router.put("/lose/:wallet", (req, res) => {
    const _wallet = req.params.wallet;
    console.log(_wallet);
    con.query(
      `UPDATE user SET lose_count = lose_count + 1 WHERE wallet = ?`,
      [_wallet],
      (err, result) => {
        if (err) {
          res.send("ERROR");
        } else {
          res.send("정상 처리");
        }
      }
    );
  });

  return router;
};
