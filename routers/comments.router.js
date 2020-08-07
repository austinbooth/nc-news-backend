const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteCommentById,
} = require("../controllers/comments.controller");

commentsRouter.patch("/:comment_id", patchCommentVotes);
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
