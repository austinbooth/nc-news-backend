const db = require("../db/connection");

exports.fetchTopics = () => {
  return db("topics").select("*");
};

exports.checkIfTopicExists = (topic) => {
  return db("topics")
    .select("*")
    .where({ slug: topic })
    .then((topic) => {
      if (topic.length === 0)
        return Promise.reject({ status: 404, msg: "Topic not found" });
    });
};
