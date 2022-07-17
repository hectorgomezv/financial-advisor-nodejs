const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const PositionsService = require('./positions-service');
const { Portfolio } = require('../entities');
const { PortfoliosRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');
const { getFx } = require('../../../../infrastructure/datasources/http/currency-exchange-client');

const ajv = new Ajv();

const portfolioSchema = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
});

const getTotalValueEUR = async positions => {
  const fx = await getFx();
  const totalValueUSD = positions.reduce((acc, pos) => acc + pos.value, 0);

  return fx(totalValueUSD).from('USD').to('EUR');
};

const createPortfolio = async (data, ownerId) => {
  if (!portfolioSchema(data)) {
    throw new ValidationError(portfolioSchema.errors);
  }

  const portfolio = new Portfolio(data.name, ownerId);
  await PortfoliosRepository.createPortfolio(portfolio);

  return portfolio;
};

const getPortfoliosByOwnerId = ownerId => PortfoliosRepository.findByOwnerId(ownerId);

const getPortfolioByUuidAndOwnerId = async (uuid, ownerId) => {
  const portfolio = await PortfoliosRepository.findByUuidAndOwnerId(uuid, ownerId);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);
  const sumWeights = positions.reduce((acc, pos) => acc + pos.targetWeight, 0);
  const isValid = (sumWeights === 100);
  const totalValueEUR = await getTotalValueEUR(positions);

  return {
    ...portfolio,
    positions,
    state: {
      isValid,
      sumWeights,
      totalValueEUR,
    },
  };
};

const deletePortfolioByUuidAndOwnerId = async (uuid, ownerId) => {
  await getPortfolioByUuidAndOwnerId(uuid, ownerId);

  return PortfoliosRepository.deleteByUuid(uuid);
};

module.exports = {
  createPortfolio,
  deletePortfolioByUuidAndOwnerId,
  getPortfoliosByOwnerId,
  getPortfolioByUuidAndOwnerId,
};
