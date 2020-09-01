const db = require("../db/connection");

exports.fetchArticle = (article_id) => {
  return db
    .select("articles.*")
    .count({ comment_count: "comments.article_id" })
    .from("articles")
    .where("articles.article_id", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (article === undefined)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article;
    });
};

exports.modifyArticleVotes = (article_id, inc_votes = 0) => {
  return db("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([article]) => {
      if (article === undefined)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article;
    });
};

exports.checkIfArticleExists = (article_id) => {
  return db("articles")
    .modify((query) => {
      if (article_id) query.where({ article_id });
    })
    .then(([article]) => {
      if (article === undefined)
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      return article;
    });
};

exports.checkIfAuthorExists = (author) => {
  return db("articles")
    .modify((query) => {
      if (author) query.where({ author });
    })
    .then(([article]) => {
      if (article === undefined)
        return {
          status: 200,
          articles: [],
        };
      return article;
    });
};

exports.fetchAllArticles = (
  orderBy = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order === "asc" || order === "desc") {
    return db("articles")
      .select([
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes",
      ])
      .modify((query) => {
        if (author) query.where("articles.author", author);
        if (topic) query.where("articles.topic", topic);
      })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .count({ comment_count: "comments.comment_id" })
      .orderBy(orderBy, order)
      .then((articles) => {
        return articles;
      });
  } else return Promise.reject({ status: 400, msg: "Invalid query" });
};
