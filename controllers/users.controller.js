const { fetchUser } = require("../models/users.model");

exports.getUser = (req, res, next) => {
  console.log("in the controller");
  fetchUser(req.params).then((user) => {
    res.status(200).send({user});
  }).catch(err => next(err));
};
