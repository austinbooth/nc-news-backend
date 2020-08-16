const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const { handle405sInvalidMethods } = require("../errors");

topicsRouter.route("/").get(getTopics).all(handle405sInvalidMethods);

module.exports = topicsRouter;
