const usersRouter = require("express").Router();
const { getUser } = require("../controllers/users.controller");
const { handle405sInvalidMethods } = require("../errors");

usersRouter.route("/:username").get(getUser);

usersRouter.route("/").all(handle405sInvalidMethods);

module.exports = usersRouter;
