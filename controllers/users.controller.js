const { fetchUser } = require("../models/users.model");

exports.getUser = (req, res, next) => {
  const {
    params: { username },
  } = req;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
