const Ajv = require('ajv');
const { v4: uuidv4 } = require('uuid');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { CompaniesRepository, CompanyStatesRepository } = require('../repositories');
const { AlreadyExistError } = require('../../../shared/domain/errors');
const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');

const ajv = new Ajv();
const companySchema = ajv.compile({
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

const createCompany = async data => {
  if (!companySchema(data)) {
    throw new ValidationError(companySchema.errors);
  }

  const company = buildCompany(data);
  const exists = await CompaniesRepository.findBySymbol(company.symbol);

  if (exists) {
    throw new AlreadyExistError(`Company ${company.symbol} already exists`);
  }

  await CompaniesRepository.createCompany(company);
  const companyState = await yahooFinanceClient.getQuoteSummary(company.symbol);
  await CompanyStatesRepository.createCompanyState({ ...companyState, companyUuid: company.uuid });

  return company;
};

const getAll = () => CompaniesRepository.find();

const getCompaniesWithLastState = async uuids => {
  const companies = await CompaniesRepository.findByUuidIn(uuids);
  const promises = companies.map(c => CompanyStatesRepository.getLastByCompanyUuid(c.uuid));
  const states = await Promise.all(promises);

  return companies.map(company => ({
    ...company,
    state: { ...states.find(s => s.companyUuid === company.uuid) },
  }));
};

module.exports = {
  createCompany,
  getAll,
  getCompaniesWithLastState,
};
