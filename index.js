const express = require("express");
const app = express();
const Web3 = require("web3");
const { swaggerUi, specs } = require("./swagger/swagger");
const ticket = require("./routes/ticket")();
const count = require("./routes/count")();
const member = require("./routes/member")();

app.use("/ticket", ticket);
app.use("/count", count);
app.use("/member", member);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
  console.log("Server Start");
});
