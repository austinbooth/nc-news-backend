const ENV = process.env.NODE_ENV || "development";
const userInfo = require("./user.info");

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      ...userInfo,
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      ...userInfo,
    },
  },
};

const log = console.log;
console.log = (...args) => {
  if (!/FsMigrations/.test(args[0])) log(...args);
};

module.exports = { ...customConfig[ENV], ...baseConfig };
