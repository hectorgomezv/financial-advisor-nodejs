const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { PositionsRepository } = require('../repositories');
const { findCompanyBySymbol } = require('../../../companies/domain/use-cases');
const { AlreadyExistError } = require('../../../shared/domain/errors');
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

module.exports = async input => {
  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const company = await findCompanyBySymbol(input.symbol);
  const position = new Position(input.targetWeight, input.shares, company.uuid, company.symbol);
  const currentPositions = await PositionsRepository.findByCompanyUuid(position.companyUuid);

  if (currentPositions.length) {
    throw new AlreadyExistError(`Position for company ${input.symbol} (${position.companyUuid}) already exists`);
  }

  await PositionsRepository.createPosition(position);

  return position;
};
