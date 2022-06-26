const cache = require('./datasources/database/redis');
const database = require('./datasources/database/mongo');
const http = require('./http');
const logger = require('./logger');

module.exports = {
  cache,
  database,
  http,
  logger,
};
