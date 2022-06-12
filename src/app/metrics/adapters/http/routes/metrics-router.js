const { getMetricsCtl } = require('../controllers/metrics-controller');

const BASE_URL = '/api/v1/metrics';

const metricsRouter = app => {
  app.route({
    method: 'GET',
    url: BASE_URL,
    handler: getMetricsCtl,
  });
};

module.exports = metricsRouter;
