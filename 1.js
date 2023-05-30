const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.db_pass,
  database: process.env.db,
});

app.listen(5000, () => {
  console.log("Server Start");
});
