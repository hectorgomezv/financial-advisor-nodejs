const Ajv = require('ajv');
const { v4: uuidv4 } = require('uuid');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { CompaniesRepository, CompanyStatesRepository } = require('../repositories');
const { RbacService } = require('../../../shared/domain/services');
const { AlreadyExistError } = require('../../../shared/domain/errors');

const ajv = new Ajv();
const validate = ajv.compile({
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['symbol', 'name'],
  additionalProperties: false,
});

const buildCompany = input => ({
  name: input.name.trim(),
  symbol: input.symbol.toUpperCase(),
  uuid: uuidv4(),
});

module.exports = async (context, input) => {
  await RbacService.isUserAllowedTo(context, 'create', 'company');

  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const company = buildCompany(input);
  const exists = await CompaniesRepository.findBySymbol(company.symbol);

  if (exists) {
    throw new AlreadyExistError(`Company ${company.symbol} already exists`);
  }

  await CompaniesRepository.createCompany(company);
  await CompanyStatesRepository.refreshCompanyState(company);

  return company;
};
