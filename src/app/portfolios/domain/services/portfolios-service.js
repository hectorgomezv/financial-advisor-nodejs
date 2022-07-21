const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const PositionsService = require('./positions-service');
const { Portfolio } = require('../entities');
const { PortfolioMetricsMapper, TimeRangeMapper } = require('./mappers');
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

/**
 * Creates a new portfolio
 * @param {Object} data input
 * @param {String} ownerId
 * @returns {Portfolio} created
 */
const createPortfolio = async (data, ownerId) => {
  if (!portfolioSchema(data)) {
    throw new ValidationError(portfolioSchema.errors);
  }

  const portfolio = new Portfolio(data.name, ownerId);
  await PortfoliosRepository.createPortfolio(portfolio);

  return portfolio;
};

/**
 * Finds all portfolios
 * @returns {Portfolio[]}
 */
const getAll = () => PortfoliosRepository.findAll();

/**
 * Finds all portfolios by ownerId
 * @param {String} ownerId
 * @returns {Portfolio[]}
 */
const getPortfoliosByOwnerId = ownerId => PortfoliosRepository.findByOwnerId(ownerId);

/**
 * Finds a portfolio by uuid and ownerId. Decorates the portfolio
 * with associated positions and last state.
 * @param {String} uuid
 * @param {String} ownerId
 * @returns {Portfolio} with positions and state
 */
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

/**
 * Returns an array of PortfolioMetric with values within the range passed.
 * @param {String} uuid
 * @param {String} ownerId
 * @param {String} rangeStr string representing the range for the computation
 * @returns {PortfolioMetric[]}
 */
const getPortfolioMetricsByUuidAndOwnerId = async (uuid, ownerId, rangeStr) => {
  const portfolio = await PortfoliosRepository.findByUuidAndOwnerId(uuid, ownerId);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  const range = TimeRangeMapper.from(rangeStr);
  const series = await PortfolioStatesRepository.getSeriesForRange(uuid, range);

  return series.filter(s => s.average).map(s => PortfolioMetricsMapper.from(s));
};

/**
 * Deletes a portfolio
 * @param {String} uuid
 * @param {String} ownerId
 * @returns null
 */
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
