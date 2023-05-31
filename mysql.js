const mysql = require("mysql2");
require("dotenv").config();
const con = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.db_pass,
  database: process.env.db,
});

module.exports = con;
