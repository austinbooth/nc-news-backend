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

articlesRouter.route("/").get(getAllArticles).all(handle405sInvalidMethods);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(handle405sInvalidMethods);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(handle405sInvalidMethods);

module.exports = articlesRouter;
