require('dotenv').config();
require('newrelic');

const { logger, http } = require('./infrastructure');

const { HTTP_SERVER_PORT } = process.env;

const start = async () => {
  try {
    await http.webServer.listen(HTTP_SERVER_PORT);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
