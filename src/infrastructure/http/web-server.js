const fastify = require('fastify');
const healthRouter = require('../../app/health/adapters/http/routes/health-router');
const companiesRouter = require('../../app/companies/adapters/http/routes/companies-router');

const logger = require('../logger');

const app = fastify({ logger });

companiesRouter(app);
healthRouter(app);

const listen = (port) => {
  app.listen(port, '0.0.0.0', (err) => {
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