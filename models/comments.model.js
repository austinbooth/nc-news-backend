const db = require("../db/connection");
const { username } = require("../user.info");

exports.addComment = ({ article_id }, { username: author, body }) => {
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
    .then((comment) => {
      comment[0].created_at = comment[0].created_at.toISOString();
      return comment[0];
    });
};

exports.fetchCommentsByArticleId = ({ article_id }) => {
  return db.select().from("comments").where("article_id", article_id);
};

exports.updateCommentVotes = ({ comment_id }, { inc_votes }) => {
  if (inc_votes === undefined) inc_votes = 0;
  return db("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then((comment) => {
      if (comment.length === 0)
        return Promise.reject({ status: 404, msg: "comment not found" });
      return comment[0];
    });
};
