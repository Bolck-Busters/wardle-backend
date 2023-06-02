const plus_win = `UPDATE user SET win_count = win_count + 1 WHERE wallet = ?`;
const plus_lose = `UPDATE user SET lose_count = lose_count + 1 WHERE wallet = ?`;

const buy_ticket = `UPDATE user SET ticket_count = ticket_count + ? WHERE wallet = ?`;
const use_ticket = `UPDATE user SET ticket_count = ticket_count - ? WHERE wallet = ?`;

const reward = `UPDATE user SET reward_ticket = reward_ticket + ? WHERE wallet = ?`;
const exchange = `UPDATE user SET reward_ticket = reward_ticket - ? WHERE wallet = ?`;

const divide = `SELECT nickname FROM user WHERE wallet = ?`;
const login = `SELECT * FROM user WHERE wallet = ?`;
const signup =
  "INSERT INTO user (`wallet`, `nickname`) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT `wallet`, nickname FROM user WHERE nickname = ?)";
const withdrawl = `DELETE FROM user WHERE wallet = ?`;
const give_problem = `SELECT answer FROM problem WHERE length = ? ORDER BY rand() LIMIT 1`;

module.exports = {
  plus_win,
  plus_lose,
  use_ticket,
  buy_ticket,
  reward,
  exchange,
  divide,
  login,
  signup,
  withdrawl,
  give_problem,
};
