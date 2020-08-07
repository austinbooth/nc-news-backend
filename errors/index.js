exports.handle405sInvalidMethods = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

exports.handlePSQL400Errors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703")
    res.status(400).send({ msg: `Invalid ${err.reason}` });
  else next(err);
};

exports.handlePSQL404Errors = (err, req, res, next) => {
  if (err.code === "23503")
    res.status(404).send({ msg: `Invalid ${err.reason}` });
  else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server error");
};
