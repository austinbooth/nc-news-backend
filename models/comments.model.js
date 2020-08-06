const db = require("../db/connection");

exports.addComment = ({ article_id }, { username: author, body }) => {
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
