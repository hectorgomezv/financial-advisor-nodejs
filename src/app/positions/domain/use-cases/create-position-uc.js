const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { PositionsRepository } = require('../repositories');
const { PortfoliosRepository } = require('../../../portfolios/domain/repositories');
const { findCompanyBySymbol } = require('../../../companies/domain/use-cases');
const { AlreadyExistError, NotFoundError } = require('../../../shared/domain/errors');
const Position = require('../entities/position');

const inputSchema = {
  type: 'object',
  properties: {
    targetWeight: { type: 'number', minimum: 0, maximum: 100 },
    shares: { type: 'number' },
    symbol: { type: 'string' },
  },
  required: ['targetWeight', 'shares', 'symbol'],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(inputSchema);

module.exports = async (portfolioUuid, input) => {
  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const portfolio = PortfoliosRepository.findByUuid(portfolioUuid);
  const company = await findCompanyBySymbol(input.symbol);

  if (!portfolio || !company) {
    throw new NotFoundError('Invalid reference for position');
  }

  const position = new Position(
    portfolio.uuid,
    input.targetWeight,
    input.shares,
    company.uuid,
    company.symbol,
  );

  const currentPositions = await PositionsRepository
    .findByCompanyUuidAndPortfolioUuid(position.companyUuid, position.portfolioUuid);

  if (currentPositions.length) {
    throw new AlreadyExistError(`Position for company ${input.symbol} and portfolio ${portfolio.name} already exists`);
  }

  await PositionsRepository.createPosition(position);

  return position;
};
