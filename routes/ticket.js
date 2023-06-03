const express = require("express");
const router = express.Router();
const con = require("../mysql");
const sql = require("../sql");
const logger = require("../logger");

/**
 * @swagger
 * tags:
 *   name: ticket
 *   description: 티켓 관련
 */
module.exports = function () {
  /**
   * @swagger
   * /ticket/buy:
   *    put:
   *      tags: [ticket]
   *      summary: 티켓 구입
   *      parameters:
   *        - name: JSON
   *          in: body
   *          description: 지갑 주소 & 티켓 수량
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *              count:
   *                type: number
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
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

  /**
   * @swagger
   * /ticket/use:
   *    put:
   *      tags: [ticket]
   *      summary: 티켓 사용
   *      parameters:
   *        - name: JSON
   *          in: body
   *          description: 지갑 주소 & 티켓 수량 & 컨트랙트 메소드 수행 결과
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *              count:
   *                type: number
   *              result:
   *                type: boolean
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
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

  /**
   * @swagger
   * /ticket/reward:
   *    put:
   *      tags: [ticket]
   *      summary: 보상 티켓 획득
   *      parameters:
   *        - name: JSON
   *          in: body
   *          description: 지갑 주소 & 티켓 수량 & 컨트랙트 메소드 수행 결과
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *              count:
   *                type: number
   *              result:
   *                type: boolean
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
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

  /**
   * @swagger
   * /ticket/exchange:
   *    put:
   *      tags: [ticket]
   *      summary: 보상 티켓 사용
   *      parameters:
   *        - name: JSON
   *          in: body
   *          description: 지갑 주소 & 티켓 수량 & 컨트랙트 메소드 수행 결과
   *          required: true
   *          schema:
   *            type: object
   *            properties:
   *              wallet:
   *                type: string
   *              count:
   *                type: number
   *              result:
   *                type: boolean
   *      responses:
   *        200:
   *          description: Sucess
   *          content:
   *            application/json
   */
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
