require('dotenv').config();
require('newrelic');

const {
  http,
  logger,
  database,
} = require('./src/infrastructure');

const { FINANCIAL_ADVISOR_HTTP_SERVER_PORT } = process.env;

const start = async () => {
  try {
    await http.webServer.listen(FINANCIAL_ADVISOR_HTTP_SERVER_PORT);
  } catch (err) {
    logger.error(err);
    database.shutdown();
    process.exit(1);
  }
};

start();
