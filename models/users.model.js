const db = require("../db/connection");

exports.fetchUser = ({ username }) => {
  return db("users")
    .select("*")
    .where("username", username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return user[0];
    });
};
