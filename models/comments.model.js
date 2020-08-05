const db = require("../db/connection");
const knexfile = require("../knexfile");

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
