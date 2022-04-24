const fastify = require('fastify');
const logger = require('../logger');
const healthRouter = require('../../app/health/adapters/http/routes/health-router');
const companiesRouter = require('../../app/companies/adapters/http/routes/companies-router');
const positionsRouter = require('../../app/positions/adapters/http/routes/positions-router');
const portfoliosRouter = require('../../app/portfolios/adapters/http/routes/portfolios-router');

const app = fastify({ logger });

companiesRouter(app);
healthRouter(app);
positionsRouter(app);
portfoliosRouter(app);

const listen = port => {
  app.listen(port, '0.0.0.0', err => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
};

module.exports = {
  app,
  listen,
};
