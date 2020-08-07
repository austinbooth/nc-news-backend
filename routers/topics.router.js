const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const { handle405sInvalidMethods } = require("../errors");

topicsRouter.get("/", getTopics);
topicsRouter.all("/", handle405sInvalidMethods);

module.exports = topicsRouter;
