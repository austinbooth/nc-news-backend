const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes,
} = require("../controllers/articles.controller");
const { postComment } = require("../controllers/comments.controller");

articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
