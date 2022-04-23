const Ajv = require('ajv');
const { v4: uuidv4 } = require('uuid');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { companiesRepository } = require('../repositories');
const { AlreadyExistError } = require('../errors');

const schema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['symbol', 'name'],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

const parseInput = input => ({
  name: input.name.trim(),
  symbol: input.symbol.toUpperCase(),
  uuid: uuidv4(),
});

module.exports = async input => {
  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const company = parseInput(input);
  const exists = await companiesRepository.findBySymbol(company.symbol);

  if (exists) {
    throw new AlreadyExistError(`Company ${company.symbol} already exists`);
  }

  await companiesRepository.createCompany(company);

  return company;
};
