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
