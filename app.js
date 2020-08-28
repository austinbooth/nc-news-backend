const express = require("express");
const apiRouter = require("./routers/api.router");
const {
  handle500s,
  handleCustomErrors,
  handlePSQL400Errors,
  handlePSQL404Errors,
} = require("./errors");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePSQL400Errors);
app.use(handlePSQL404Errors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
