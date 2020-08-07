const usersRouter = require("express").Router();
const { getUser } = require("../controllers/users.controller");
const { handle405sInvalidMethods } = require("../errors");

usersRouter.get("/:username", getUser);
usersRouter.all("/", handle405sInvalidMethods);

module.exports = usersRouter;
