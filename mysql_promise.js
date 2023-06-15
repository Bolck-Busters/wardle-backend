const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = mysql.createPool({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.db_pass,
  database: process.env.db,
});

module.exports = pool;
