const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes,
  getAllArticles,
} = require("../controllers/articles.controller");
const {
  postComment,
  getCommentsByArticleId,
} = require("../controllers/comments.controller");
const { handle405sInvalidMethods } = require("../errors");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.all("/", handle405sInvalidMethods);
articlesRouter.all("/:article_id", handle405sInvalidMethods);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(handle405sInvalidMethods);

module.exports = articlesRouter;
