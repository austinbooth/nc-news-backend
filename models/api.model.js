const { readFile } = require("fs");

exports.fetchAllEndpoints = () => {
  return new Promise((resolve, reject) => {
    readFile("endpoints.json", "utf8", (err, endpoints) => {
      if (err) reject(err);
      resolve(JSON.parse(endpoints));
    });
  });
};
