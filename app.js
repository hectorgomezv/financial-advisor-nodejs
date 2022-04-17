require('dotenv').config();
require('newrelic');

const fastify = require('fastify')({
  logger: true,
});

const { HTTP_SERVER_PORT } = process.env;

fastify.get('/', async () => ({ hello: 'world' }));

const start = async () => {
  try {
    await fastify.listen(HTTP_SERVER_PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
