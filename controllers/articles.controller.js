const { fetchArticle } = require("../models/articles.model");

exports.getArticle = (req, res) => {
  fetchArticle(req.params)
    .then((article) => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
