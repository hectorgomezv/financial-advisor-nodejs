const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { PortfoliosRepository, PositionsRepository } = require('../repositories');
const { findCompanyBySymbol } = require('../../../companies/domain/use-cases');
const { AlreadyExistError, NotFoundError } = require('../../../shared/domain/errors');
const { RbacService } = require('../../../shared/domain/services');
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

module.exports = async (context, portfolioUuid, input) => {
  await RbacService.isUserAllowedTo(context, 'create', 'portfolio');

  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const portfolio = await PortfoliosRepository.findByUuid(portfolioUuid);
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
