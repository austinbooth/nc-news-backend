const express = require("express");
const apiRouter = require("./routers/api.router");

const app = express();

app.use("/api", apiRouter);

app.use(handleCustomErrors);

function handleCustomErrors(err, req, res, next) {
  console.log("Error:", err);
  res.status(err.status).send({ msg: err.msg });
}

module.exports = app;
