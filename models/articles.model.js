const db = require("../db/connection");

exports.fetchArticle = ({ article_id }) => {
  return db
    .select("articles.*")
    .count({ comment_count: "comments.article_id" })
    .from("articles")
    .where("articles.article_id", article_id)
    .join("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then((article) => {
      article[0].comment_count = +article[0].comment_count;
      return article[0];
    });
};
