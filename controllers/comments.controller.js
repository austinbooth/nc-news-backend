const { addComment } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
  if (req.body.username === undefined || req.body.username.length === 0)
    res.status(400).send({ msg: "Invalid - username not given" });
  if (req.body.body === undefined || req.body.body.length === 0)
    res.status(400).send({ msg: "Invalid - body not given" });

  addComment(req.params, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.detail && err.detail.includes(`is not present in table "users"`))
        err.reason = "username";
      else err.reason = "article id";
      return next(err);
    });
};
