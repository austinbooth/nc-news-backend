const db = require("../db/connection");

exports.addComment = (article_id, author, body) => {
  if (body === undefined || body.length === 0)
    return Promise.reject({ status: 400, msg: "Invalid - body not given" });
  if (author === undefined || author.length === 0)
    return Promise.reject({ status: 400, msg: "Invalid - username not given" });
  return db("comments")
    .insert({
      author,
      article_id,
      body,
    })
    .returning("*")
    .then(([comment]) => {
      comment.created_at = comment.created_at.toISOString();
      return comment;
    });
};

exports.fetchCommentsByArticleId = (
  article_id,
  order = "desc",
  sort_by = "created_at"
) => {
  if (order === "asc" || order === "desc") {
    return db
      .select()
      .from("comments")
      .where("article_id", article_id)
      .orderBy(sort_by, order);
  } else return Promise.reject({ status: 400, msg: "Invalid query" });
};

exports.updateCommentVotes = (comment_id, inc_votes = 0) => {
  return db("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(([comment]) => {
      if (comment === undefined)
        return Promise.reject({ status: 404, msg: "comment not found" });
      return comment;
    });
};

exports.removeCommentById = (comment_id) => {
  return db("comments")
    .where({ comment_id })
    .del()
    .returning("*")
    .then(([deleted]) => {
      if (deleted === undefined)
        return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};
