const fastify = require('fastify');
const cors = require('@fastify/cors');
const logger = require('../logger');
const healthRouter = require('../../app/health/adapters/http/routes/health-router');
const companiesRouter = require('../../app/companies/adapters/http/routes/companies-router');
const portfoliosRouter = require('../../app/portfolios/adapters/http/routes/portfolios-router');

const { CORS_BASE_URL } = process.env;

const app = fastify({ logger });

app.register(cors, {
  origin: (origin, cb) => {
    const { hostname } = new URL(origin);
    const allowed = (hostname === 'localhost' || hostname === new URL(CORS_BASE_URL).hostname);

    return allowed ? cb(null, true) : cb(new Error('Not allowed'));
  },
});

companiesRouter(app);
healthRouter(app);
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
