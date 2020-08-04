const db = require("../db/connection");

exports.fetchTopics = () => {
  return db("topics").select("*");
};
