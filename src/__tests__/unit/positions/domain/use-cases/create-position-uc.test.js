const { faker } = require('@faker-js/faker');
const matchers = require('jest-extended');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { createPosition } = require('../../../../../app/portfolios/domain/use-cases');
const { CompaniesRepository } = require('../../../../../app/companies/domain/repositories');
const { PortfoliosRepository, PositionsRepository } = require('../../../../../app/portfolios/domain/repositories');
const { NotFoundError, AlreadyExistError } = require('../../../../../app/shared/domain/errors');
const { RbacService } = require('../../../../../app/shared/domain/services');
const Company = require('../../../../../app/companies/domain/entities/company');
const { Portfolio, Position } = require('../../../../../app/portfolios/domain/entities');

expect.extend(matchers);

const INPUT_POSITION = {
  targetWeight: faker.datatype.number({ max: 100 }),
  shares: 10,
  symbol: 'AAPL',
};

const COMPANY = new Company('Apple Inc.', 'AAPL');
const CURRENT_POSITIONS = [new Position(faker.datatype.number({ max: 100 }), 10, 'AAPL')];
const PORTFOLIO = new Portfolio(faker.name.firstName(), faker.datatype.uuid());
const CONTEXT = {};

describe('[unit tests] [create-position-uc]', () => {
  beforeEach(() => {
    PortfoliosRepository.findByUuid = jest.fn().mockReturnValue(PORTFOLIO);
    CompaniesRepository.findBySymbol = jest.fn().mockReturnValue(COMPANY);
    RbacService.isUserAllowedTo = jest.fn().mockReturnValue(true);

    PositionsRepository.findByCompanyUuidAndPortfolioUuid = jest.fn()
      .mockReturnValue(CURRENT_POSITIONS);
  });

  test('portfolio for the position should exist', async () => {
    PortfoliosRepository.findByUuid = jest.fn().mockReturnValue(null);

    await expect(createPosition(CONTEXT, PORTFOLIO.uuid, INPUT_POSITION))
      .rejects
      .toThrow(NotFoundError);
  });

  test('company for the position should exist', async () => {
    CompaniesRepository.findBySymbol = jest.fn().mockReturnValue(null);

    await expect(createPosition(CONTEXT, PORTFOLIO.uuid, INPUT_POSITION))
      .rejects
      .toThrow(NotFoundError);
  });

  test('targetWeight should between 0 and 100', async () => {
    await expect(createPosition(CONTEXT, PORTFOLIO.uuid, { ...INPUT_POSITION, targetWeight: -3 }))
      .rejects
      .toThrow(ValidationError);

    await expect(createPosition(CONTEXT, PORTFOLIO.uuid, { ...INPUT_POSITION, targetWeight: 101 }))
      .rejects
      .toThrow(ValidationError);
  });

  test('a position should be unique for the portfolio/company', async () => {
    await expect(createPosition(CONTEXT, PORTFOLIO.uuid, INPUT_POSITION))
      .rejects
      .toThrow(AlreadyExistError);
  });

  test('should return the created position', async () => {
    const companyUuid = faker.datatype.uuid();
    CompaniesRepository.findBySymbol = jest.fn().mockReturnValue({ ...COMPANY, uuid: companyUuid });
    PositionsRepository.findByCompanyUuidAndPortfolioUuid = jest.fn().mockReturnValue([]);
    PositionsRepository.createPosition = jest.fn();

    const result = await createPosition(CONTEXT, PORTFOLIO.uuid, INPUT_POSITION);

    expect(result).toContainEntries([
      ['targetWeight', INPUT_POSITION.targetWeight],
      ['shares', INPUT_POSITION.shares],
      ['symbol', INPUT_POSITION.symbol],
      ['companyUuid', companyUuid],
    ]);
  });
});
