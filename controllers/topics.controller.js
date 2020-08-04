const { fetchTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  console.log("in the topics controller");
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};
