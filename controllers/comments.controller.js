const {
  addComment,
  fetchCommentsByArticleId,
  updateCommentVotes,
  removeCommentById,
} = require("../models/comments.model");
const { checkIfArticleExists } = require("../models/articles.model");
const articlesRouter = require("../routers/articles.router");

exports.postComment = (req, res, next) => {
  const {
    params: { article_id },
    body: { username: author, body },
  } = req;
  addComment(article_id, author, body)
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
  const {
    params: { article_id },
    query: { order, sort_by },
  } = req;

  Promise.all([
    fetchCommentsByArticleId(article_id, order, sort_by),
    checkIfArticleExists(article_id),
  ])
    .then(([comments]) => res.status(200).send({ comments }))
    .catch((err) => {
      err.reason = "article id or query";
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const {
    params: { comment_id },
    body: { inc_votes },
  } = req;
  updateCommentVotes(comment_id, inc_votes)
    .then((comment) => res.status(200).send({ comment }))
    .catch((err) => {
      err.reason = "comment id or payload";
      return next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const {
    params: { comment_id },
  } = req;
  removeCommentById(comment_id)
    .then(() => res.sendStatus(204))
    .catch((err) => {
      err.reason = "comment id";
      return next(err);
    });
};
