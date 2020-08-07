const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteCommentById,
} = require("../controllers/comments.controller");
const { handle405sInvalidMethods } = require("../errors");

commentsRouter.patch("/:comment_id", patchCommentVotes);
commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.all("/:comment_id", handle405sInvalidMethods);

module.exports = commentsRouter;
