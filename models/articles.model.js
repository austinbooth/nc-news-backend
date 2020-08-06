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
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
      article[0].comment_count = +article[0].comment_count;
      return article[0];
    });
};

exports.modifyArticleVotes = ({ article_id }, { inc_votes }) => {
  if (inc_votes === undefined) inc_votes = 0;
  return (
    db("articles")
      .where("article_id", article_id)
      // .update({ votes: db.raw(`votes + ${inc_votes}`) })
      .increment("votes", inc_votes)
      .returning("*")
      .then((article) => {
        if (article.length === 0)
          return Promise.reject({ status: 404, msg: "Article not found" });
        return article[0];
      })
  );
};

exports.checkIfArticleExists = ({ article_id }) => {
  return db("articles")
    .where({ article_id })
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article;
    });
};

exports.fetchAllArticles = () => {
  return db("articles")
    .select([
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes",
    ])
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .then((articles) => {
      return articles;
    });
};
