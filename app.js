require('dotenv').config();
require('newrelic');

const { http, logger, database } = require('./src/infrastructure');
const { RbacService } = require('./src/app/shared/domain/services');
const { CompaniesRepository, CompanyStatesRepository } = require('./src/app/companies/domain/repositories');
const { PortfoliosRepository, PositionsRepository } = require('./src/app/portfolios/domain/repositories');
const companiesTasks = require('./src/app/companies/domain/tasks');

const { HTTP_SERVER_PORT } = process.env;

(async () => {
  try {
    await RbacService.init();
    const dbInstance = await database.getDb();
    await CompaniesRepository.init(dbInstance);
    await CompanyStatesRepository.init(dbInstance);
    await PortfoliosRepository.init(dbInstance);
    await PositionsRepository.init(dbInstance);
    await http.webServer.listen(HTTP_SERVER_PORT);
    companiesTasks.start();
  } catch (err) {
    logger.error(err);
    database.shutdown();
    process.exit(1);
  }
})();
