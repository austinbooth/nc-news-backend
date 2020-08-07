const express = require("express");
const apiRouter = require("./routers/api.router");
const {
  handle405sInvalidMethods,
  handle500s,
  handleCustomErrors,
  handlePSQL400Errors,
  handlePSQL404Errors,
} = require("./errors");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQL400Errors);
app.use(handlePSQL404Errors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
