const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");
const request = require("request");

/**
 * @swagger
 * tags:
 *   name: ticket
 *   description: 티켓 관련
 */
module.exports = function () {
  // 티켓 구입
  router.put("/buy", (req, res) => {
    const _wallet = req.body.wallet;
    const _count = req.body.count;
    console.log(_wallet, _count);

    con.query(sql.buy_ticket, [_count, _wallet], (err, result) => {
      if (err) {
        res.json({
          msg: "티켓 구입에 실패했습니다.",
          result: false,
        });
      } else {
        res.json({
          msg: "티켓 구입에 성공하였습니다.",
          result: true,
        });
      }
    });
  });

  // 티켓 사용
  router.put("/use", (req, res) => {
    const _wallet = req.body.wallet;
    const _count = req.body.count;
    const _result = req.body.result;
    console.log(_wallet, _count, _result);

    if (_result) {
      con.query(sql.use_ticket, [_count, _wallet], (err, result) => {
        if (err) {
          res.json({
            msg: "티켓 사용에 실패했습니다. (DB 오류)",
            result: false,
          });
        } else {
          res.json({
            msg: "티켓 사용이 정상적으로 처리되었습니다.",
            result: true,
          });
        }
      });
    } else {
      res.json({
        msg: "티켓 사용에 실패했습니다. (Contract 오류)",
        result: false,
      });
    }
  });

  // 보상 티켓 획득
  router.put("/reward", (req, res) => {
    const _wallet = req.body.wallet;
    const _count = req.body.count;
    const _result = req.body.result;
    console.log(_wallet, _count, _result);

    if (_result) {
      con.query(sql.reward, [_count, _wallet], (err, result) => {
        if (err) {
          res.json({
            msg: "보상 티켓 획득에 실패했습니다. (DB 오류)",
            result: false,
          });
        } else {
          res.json({
            msg: "보상 티켓 획득이 정상적으로 처리되었습니다.",
            result: true,
          });
        }
      });
    } else {
      res.json({
        msg: "보상 티켓 획득에 실패했습니다. (Contract 오류)",
        result: false,
      });
    }
  });

  // 보상 티켓 사용
  router.put("/exchange", (req, res) => {
    const _wallet = req.body.wallet;
    const _count = req.body.count;
    const _result = req.body.result;
    console.log(_wallet, _count, _result);

    if (_result) {
      con.query(sql.exchange, [_count, _wallet], (err, result) => {
        if (err) {
          res.json({
            msg: "보상 티켓 사용에 실패했습니다. (DB 오류)",
            result: false,
          });
        } else {
          res.json({
            msg: "보상 티켓 사용이 정상적으로 처리되었습니다.",
            result: true,
          });
        }
      });
    } else {
      res.json({
        msg: "보상 티켓 사용에 실패했습니다. (Contract 오류)",
        result: false,
      });
    }
  });

  return router;
};
