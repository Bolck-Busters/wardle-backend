const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");

module.exports = function () {
  // 문제 랜덤으로 뽑아 전송
  router.get("/random", (req, res) => {
    con.query(sql.give_problem, (err, result) => {
      if (err) {
        res.send("sql error");
      } else {
        if (result.length != 0) {
          res.send(result[0]["answer"]);
        } else {
          res.send("");
        }
      }
    });
  });

  return router;
};