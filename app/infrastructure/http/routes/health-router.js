const { getHealthController } = require('../../../interfaces/controllers/health');

const BASE_URL = '/health';

const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
      },
    },
  },
};

const healthRouter = (app) => {
  app.get(BASE_URL, { schema }, getHealthController);
};

module.exports = healthRouter;
