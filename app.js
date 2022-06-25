require('dotenv').config();
require('newrelic');
const client = require('prom-client');

const {
  cache,
  database,
  http,
  logger,
} = require('./src/infrastructure');

const { RbacService } = require('./src/app/shared/domain/services');
const { CompaniesRepository, CompanyStatesRepository } = require('./src/app/companies/domain/repositories');
const { PortfoliosRepository, PositionsRepository } = require('./src/app/portfolios/domain/repositories');
const { MetricsRepository } = require('./src/app/metrics/domain/repositories');
const companiesTasks = require('./src/app/companies/domain/tasks');

const { HTTP_SERVER_PORT } = process.env;

const { collectDefaultMetrics } = client;
const { Registry } = client;
const register = new Registry();
collectDefaultMetrics({ register });

(async () => {
  try {
    await RbacService.init();
    const dbInstance = await database.getDb();
    const cacheInstance = await cache.getCache();
    await CompaniesRepository.init(dbInstance);
    await CompanyStatesRepository.init(cacheInstance, dbInstance);
    await MetricsRepository.init(register);
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
