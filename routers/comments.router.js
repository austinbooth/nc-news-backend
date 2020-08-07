const commentsRouter = require("express").Router();
const { patchCommentVotes } = require("../controllers/comments.controller");

commentsRouter.patch("/:comment_id", patchCommentVotes);

module.exports = commentsRouter;
