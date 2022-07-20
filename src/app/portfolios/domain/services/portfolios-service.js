const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const PositionsService = require('./positions-service');
const { Portfolio } = require('../entities');
const { PortfolioMetricsMapper } = require('./mappers');
const { PortfoliosRepository, PortfolioStatesRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');

const ajv = new Ajv();

const portfolioSchema = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
});

const createPortfolio = async (data, ownerId) => {
  if (!portfolioSchema(data)) {
    throw new ValidationError(portfolioSchema.errors);
  }

  const portfolio = new Portfolio(data.name, ownerId);
  await PortfoliosRepository.createPortfolio(portfolio);

  return portfolio;
};

const getAll = () => PortfoliosRepository.findAll();

const getPortfoliosByOwnerId = ownerId => PortfoliosRepository.findByOwnerId(ownerId);

const getPortfolioByUuidAndOwnerId = async (uuid, ownerId) => {
  const portfolio = await PortfoliosRepository.findByUuidAndOwnerId(uuid, ownerId);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);
  const state = await PortfolioStatesRepository.getLastByPortfolioUuid(uuid);

  return {
    ...portfolio,
    positions,
    state: state || {},
  };
};

const getPortfolioMetricsByUuidAndOwnerId = async (uuid, ownerId) => {
  const portfolio = await PortfoliosRepository.findByUuidAndOwnerId(uuid, ownerId);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  const series = await PortfolioStatesRepository.getSeriesForWeek(uuid);

  return series.map(s => PortfolioMetricsMapper.from(s));
};

const deletePortfolioByUuidAndOwnerId = async (uuid, ownerId) => {
  await getPortfolioByUuidAndOwnerId(uuid, ownerId);
  await PortfolioStatesRepository.deleteAllByPortfolioUuid(uuid);

  return PortfoliosRepository.deleteByUuid(uuid);
};

module.exports = {
  createPortfolio,
  deletePortfolioByUuidAndOwnerId,
  getAll,
  getPortfoliosByOwnerId,
  getPortfolioByUuidAndOwnerId,
  getPortfolioMetricsByUuidAndOwnerId,
};
