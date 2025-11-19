const knexConfig = require('../knexfile');
const knex = require('knex');

const database = knex(knexConfig[process.env.ENVIRONMENT]);

module.exports = database;
