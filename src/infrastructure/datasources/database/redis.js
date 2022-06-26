const redis = require('redis');

const { REDIS_CONNECTION_STRING } = process.env;

const client = redis.createClient({ url: REDIS_CONNECTION_STRING });

(async () => {
  await client.connect();
})();

const getCache = () => client;

const shutdown = async () => {
  await client.quit();
};

module.exports = {
  getCache,
  shutdown,
};
