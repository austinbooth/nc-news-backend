const {
  fetchArticle,
  modifyArticleVotes,
  fetchAllArticles,
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      err.reason = "article id";
      return next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  modifyArticleVotes(req.params, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      err.reason = "article id";
      return next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch((err) => {
      err.reason = "column";
      return next(err);
    });
};
