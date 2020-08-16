const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteCommentById,
} = require("../controllers/comments.controller");
const { handle405sInvalidMethods } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteCommentById)
  .all(handle405sInvalidMethods);

module.exports = commentsRouter;
