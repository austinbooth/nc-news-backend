const {
  addComment,
  fetchCommentsByArticleId,
  updateCommentVotes,
  removeCommentById,
} = require("../models/comments.model");
const { checkIfArticleExists } = require("../models/articles.model");

exports.postComment = (req, res, next) => {
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

exports.getCommentsByArticleId = (req, res, next) => {
  Promise.all([
    fetchCommentsByArticleId(req.params),
    checkIfArticleExists(req.params),
  ])
    .then(([comments]) => res.status(200).send({ comments }))
    .catch((err) => {
      err.reason = "article id";
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  updateCommentVotes(req.params, req.body)
    .then((comment) => res.status(200).send({ comment }))
    .catch((err) => {
      err.reason = "comment id or payload";
      return next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      err.reason = "comment id";
      return next(err)});
};
