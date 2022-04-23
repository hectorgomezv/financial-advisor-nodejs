const Ajv = require('ajv');
const { v4: uuidv4 } = require('uuid');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { positionsRepository } = require('../repositories');
const { AlreadyExistError } = require('../errors');

const schema = {
  type: 'object',
  properties: {
    targetWeight: { type: 'number' },
    shares: { type: 'number' },
    companyId: { type: 'string' },
  },
  required: ['targetWeight', 'shares', 'companyId'],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

const parseInput = input => ({
  targetWeight: input.targetWeight,
  shares: input.shares,
  uuid: uuidv4(),
});

module.exports = async input => {
  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const position = parseInput(input);
  const exists = await positionsRepository.findByCompanyId(input.companyId);

  if (exists) {
    throw new AlreadyExistError(`Company ${position.symbol} already exists`);
  }

  await positionsRepository.createCompany(position);

  return position;
};
