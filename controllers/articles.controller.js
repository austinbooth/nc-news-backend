const {
  fetchArticle,
  modifyArticleVotes,
  fetchAllArticles,
  checkIfArticleAuthorExists,
} = require("../models/articles.model");
const { checkIfTopicExists } = require("../models/topics.model");

exports.getArticle = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      err.reason = "article id";
      return next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const {
    params: { article_id },
    body: { inc_votes },
  } = req;

  modifyArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      err.reason = "article id";
      return next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const {
    query: { sort_by, order, author, topic },
  } = req;

  const promises = [fetchAllArticles(sort_by, order, author, topic)];
  if (topic) promises.push(checkIfTopicExists(topic));
  if (author) promises.push(checkIfArticleAuthorExists(author));

  Promise.all(promises)
    .then(([articles]) => {
      return res.status(200).send({ articles });
    })
    .catch((err) => {
      err.reason = "column";
      return next(err);
    });
};
