const { StatusCodes } = require('http-status-codes');
const { MetricsRepository } = require('../../../domain/repositories');
const { mapError } = require('../../../../shared/adapters/http/error-mapper');

const getMetricsCtl = async (req, res) => {
  try {
    const metricsStr = await MetricsRepository.getMetrics();
    res.code(StatusCodes.OK).send(metricsStr);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

module.exports = {
  getMetricsCtl,
};
