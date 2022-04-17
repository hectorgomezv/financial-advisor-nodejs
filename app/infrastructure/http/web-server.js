const fastify = require('fastify');
const { companiesRouter, healthRouter } = require('./routes');
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
