require('dotenv').config();
require('newrelic');

const { http, logger, database } = require('./src/infrastructure');
const companiesTasks = require('./src/app/companies/domain/tasks');

const { HTTP_SERVER_PORT } = process.env;

const start = async () => {
  try {
    await repositories.init();
    await http.webServer.listen(HTTP_SERVER_PORT);
    companiesTasks.start();
  } catch (err) {
    logger.error(err);
    database.shutdown();
    process.exit(1);
  }
};

start();
