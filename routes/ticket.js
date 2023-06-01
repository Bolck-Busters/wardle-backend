const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");
const { smartContract, address } = require("../contract");

module.exports = function () {
  // 티켓 사용
  router.put("/use", (req, res) => {
    const _wallet = req.query.wallet;
    const _level = req.query.level;
    console.log(_wallet, _level);
    let _ticket;
    if (_level == 5) {
      _ticket = 3;
    } else if (_level == 6) {
      _ticket = 4;
    } else {
      _ticket = 5;
    }

    con.query(sql.use_ticket, [_ticket, _wallet], (err, result) => {
      if (err) {
        res.send("ERROR");
      } else {
        res.send("정상 처리");
      }
    });
  });

  // 티켓 구입
  router.put("/buy", (req, res) => {
    const _wallet = req.query.wallet;
    const _count = req.query.count;
    console.log(_wallet, _count);

    // buyTicket 메소드
    smartContract.methods
      .buyTicket(_count, _wallet)
      .call()
      .then((result) => {
        // result = {"0" : password, "1" : name, "2" : phone}
        console.log(result);
        if ((result[0] = true)) {
          con.query(sql.buy_ticket, [_count, _wallet], (err, result) => {
            if (err) {
              res.send("ERROR");
            } else {
              res.send("정상 처리");
            }
          });
        }
      });
  });

  return router;
};
