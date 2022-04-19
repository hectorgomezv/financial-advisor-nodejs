const http = require('./http');
const logger = require('./logger');
const { database } = require('./datasources/database');

module.exports = {
  http,
  logger,
  database,
};
