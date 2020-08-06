exports.handle405sInvalidMethods = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};
