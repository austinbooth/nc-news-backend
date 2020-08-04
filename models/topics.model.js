const db = require("../db/connection");

exports.fetchTopics = () => {
  console.log("in the model!");
  return db("topics").select("*");
};
