const db = require('knex');
const dbConfig = require('../knexfile');

module.exports = db(dbConfig);