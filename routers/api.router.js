const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("../routers/articles.router");
const commentsRouter = require("../routers/comments.router");
const { handle405sInvalidMethods } = require("../errors");
const { getAllEndpoints } = require("../controllers/api.controller");

apiRouter.route("/").get(getAllEndpoints).all(handle405sInvalidMethods);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
