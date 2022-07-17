const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { Portfolio } = require('../entities');
const { PortfoliosRepository } = require('../repositories');
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

const getPortfoliosByOwnerId = ownerId => PortfoliosRepository.findByOwnerId(ownerId);

const getPortfolioByUuidAndOwnerId = async (uuid, ownerId) => {
  const portfolio = await PortfoliosRepository.findByUuidAndOwnerId(uuid, ownerId);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  return portfolio;
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
