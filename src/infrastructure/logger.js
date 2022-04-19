const Pino = require('pino');

const logger = Pino({
  level: 'info',
  timestamp: () => {
    const date = new Date();

    return `,"date_access":"${date.toISOString()}"`;
  },
});

module.exports = logger;
