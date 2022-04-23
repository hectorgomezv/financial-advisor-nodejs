const Ajv = require('ajv');
const { v4: uuidv4 } = require('uuid');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { positionsRepository } = require('../repositories');
const { findCompanyBySymbol } = require('../../../companies/domain/use-cases');
const { AlreadyExistError } = require('../../../shared/domain/errors');

const schema = {
  type: 'object',
  properties: {
    targetWeight: { type: 'number' },
    shares: { type: 'number' },
    symbol: { type: 'string' },
  },
  required: ['targetWeight', 'shares', 'symbol'],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

const buildPosition = async input => {
  const company = await findCompanyBySymbol(input.symbol);

  return {
    companyId: company._id,
    symbol: company.symbol,
    uuid: uuidv4(),
    targetWeight: input.targetWeight,
    shares: input.shares,
  };
};

module.exports = async input => {
  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const position = await buildPosition(input);
  const currentPositions = await positionsRepository.findByCompanyId(position.companyId);

  if (currentPositions.length) {
    throw new AlreadyExistError(`Position for company ${input.symbol} (${position.companyId}) already exists`);
  }

  await positionsRepository.createPosition(position);

  return position;
};
