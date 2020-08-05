const express = require("express");
const apiRouter = require("./routers/api.router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQL400Errors);
app.use(handlePSQL404Errors);
app.use(handleCustomErrors);

function handlePSQL400Errors(err, req, res, next) {
  if (err.code === "22P02")
    res.status(400).send({ msg: `Invalid ${err.reason}` });
  else next(err);
}

function handlePSQL404Errors(err, req, res, next) {
  if (err.code === "23503")
    res.status(404).send({ msg: `Invalid ${err.reason}` });
  else next(err);
}

function handleCustomErrors(err, req, res, next) {
  res.status(err.status).send({ msg: err.msg });
}

module.exports = app;
