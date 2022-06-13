const fastify = require('fastify');
const cors = require('@fastify/cors');
const metricsPlugin = require('fastify-metrics');

const logger = require('../logger');
const companiesRouter = require('../../app/companies/adapters/http/routes/companies-router');
const healthRouter = require('../../app/health/adapters/http/routes/health-router');
const metricsRouter = require('../../app/metrics/adapters/http/routes/metrics-router');
const portfoliosRouter = require('../../app/portfolios/adapters/http/routes/portfolios-router');

const { CORS_BASE_URL } = process.env;

const app = fastify({ logger });

const getAllowedOrigins = () => {
  const allowedOrigins = [/localhost/];

  return CORS_BASE_URL
    ? [...allowedOrigins, new URL(CORS_BASE_URL).hostname]
    : allowedOrigins;
};

app.register(cors, { origin: getAllowedOrigins() });
app.register(metricsPlugin, { endpoint: '/api/v1/fastify-metrics' });

companiesRouter(app);
healthRouter(app);
metricsRouter(app);
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
