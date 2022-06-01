const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { Company } = require('../entities');
const { HasPositionsError } = require('../errors');
const { CompaniesRepository, CompanyStatesRepository } = require('../repositories');
const { AlreadyExistError } = require('../../../shared/domain/errors');
const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');
const { PositionsRepository } = require('../../../portfolios/domain/repositories');
const { NotFoundError } = require('../../../shared/domain/errors');
const logger = require('../../../../infrastructure/logger');

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

const createCompany = async data => {
  if (!companySchema(data)) {
    throw new ValidationError(companySchema.errors);
  }

  const company = new Company(data.name, data.symbol);
  const exists = await CompaniesRepository.findBySymbol(company.symbol);

  if (exists) {
    throw new AlreadyExistError(`Company ${company.symbol} already exists`);
  }

  await CompaniesRepository.createCompany(company);
  const companyState = await yahooFinanceClient.getQuoteSummary(company.symbol);
  logger.info(`Creating company ${company.name}-${company.symbol} with state ${companyState}`);
  await CompanyStatesRepository.createCompanyState({ ...companyState, companyUuid: company.uuid });

  return company;
};

const deleteCompany = async uuid => {
  const company = await CompaniesRepository.findByUuid(uuid);

  if (!company) {
    throw new NotFoundError(`Company with uuid ${uuid} not found`);
  }

  const positions = await PositionsRepository.findByCompanyUuid(company.uuid);

  if (positions.length) {
    throw new HasPositionsError(`Company ${company.name} has ${positions.length} positions associated`);
  }

  return CompaniesRepository.deleteById(company._id);
};

const findBySymbol = async symbol => {
  const company = await CompaniesRepository.findBySymbol(symbol);

  if (!company) {
    throw new NotFoundError(`Company with symbol ${symbol} not found`);
  }

  return company;
};

const findByUuid = async uuid => {
  const company = await CompaniesRepository.findByUuid(uuid);

  if (!company) {
    throw new NotFoundError(`Company with uuid ${uuid} not found`);
  }

  return company;
};

const getCompaniesWithLastState = async uuids => {
  const companies = await CompaniesRepository.findByUuidIn(uuids);

  const states = await Promise.all(companies
    .map(c => CompanyStatesRepository.getLastByCompanyUuid(c.uuid)));

  return companies.map(company => ({
    ...company,
    state: { ...states.find(s => s.companyUuid === company.uuid) },
  }));
};

const getAll = () => CompaniesRepository.find();

const getAllWithLastState = async () => {
  const companies = await CompaniesRepository.find();

  const states = await Promise.all(companies
    .map(c => CompanyStatesRepository.getLastByCompanyUuid(c.uuid)));

  return companies.map(company => ({
    ...company,
    state: { ...states.find(s => s.companyUuid === company.uuid) },
  }));
};

module.exports = {
  createCompany,
  deleteCompany,
  findBySymbol,
  findByUuid,
  getAll,
  getAllWithLastState,
  getCompaniesWithLastState,
};
