const http = require('./http');
const logger = require('./logger');
const database = require('./datasources/database/mongo');

module.exports = {
  http,
  logger,
  database,
};
