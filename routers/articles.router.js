const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes,
} = require("../controllers/articles.controller");
const {
  postComment,
  getCommentsByArticleId,
} = require("../controllers/comments.controller");
const { handle405sInvalidMethods } = require("../errors");

articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(handle405sInvalidMethods);

module.exports = articlesRouter;
