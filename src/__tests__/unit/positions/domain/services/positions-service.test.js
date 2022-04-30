const { faker } = require('@faker-js/faker');
const { range } = require('lodash/fp');
const matchers = require('jest-extended');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { PositionsService } = require('../../../../../app/portfolios/domain/services');
const { PortfoliosRepository, PositionsRepository } = require('../../../../../app/portfolios/domain/repositories');
const { CompaniesRepository, CompanyStatesRepository } = require('../../../../../app/companies/domain/repositories');
const { Company, CompanyState} = require('../../../../../app/companies/domain/entities');
const { Portfolio, Position } = require('../../../../../app/portfolios/domain/entities');
const { NotFoundError, AlreadyExistError } = require('../../../../../app/shared/domain/errors');

expect.extend(matchers);

const COMPANY = new Company('Apple Inc.', 'AAPL');
const PORTFOLIO = new Portfolio(faker.name.firstName(), faker.datatype.uuid());

const COMPANIES = (range(0)(4)).map(() => new Company(
  faker.company.companyName(),
  faker.random.word(),
));

const INPUT_POSITION = {
  targetWeight: faker.datatype.number({ max: 100 }),
  shares: 10,
  symbol: 'AAPL',
};

const POSITIONS = [
  new Position(PORTFOLIO.uuid, 60, 4, COMPANIES[0].uuid, COMPANIES[0].symbol),
  new Position(PORTFOLIO.uuid, 40, 5, COMPANIES[1].uuid, COMPANIES[1].symbol),
];

const COMPANY_STATES = [
  new CompanyState(COMPANIES[0].uuid, 126.22, 2.34),
  new CompanyState(COMPANIES[1].uuid, 77.87, 2.34),
];

const CURRENT_POSITIONS = [new Position(faker.datatype.number({ max: 100 }), 10, 'AAPL')];

describe('[unit tests] [positions-service]', () => {
  describe('[createPosition]', () => {
    beforeEach(() => {
      PortfoliosRepository.findByUuid = jest.fn().mockReturnValue(PORTFOLIO);
      CompaniesRepository.findBySymbol = jest.fn().mockReturnValue(COMPANY);
      PositionsRepository.findByCompanyUuidAndPortfolioUuid = jest.fn()
        .mockReturnValue(CURRENT_POSITIONS);
    });

    test('portfolio for the position should exist', async () => {
      PortfoliosRepository.findByUuid = jest.fn().mockReturnValue(null);

      await expect(PositionsService.createPosition(PORTFOLIO.uuid, INPUT_POSITION))
        .rejects
        .toThrow(NotFoundError);
    });

    test('company for the position should exist', async () => {
      CompaniesRepository.findBySymbol = jest.fn().mockReturnValue(null);

      await expect(PositionsService.createPosition(PORTFOLIO.uuid, INPUT_POSITION))
        .rejects
        .toThrow(NotFoundError);
    });

    test('targetWeight should between 0 and 100', async () => {
      await expect(PositionsService
        .createPosition(PORTFOLIO.uuid, { ...INPUT_POSITION, targetWeight: -3 }))
        .rejects
        .toThrow(ValidationError);

      await expect(PositionsService
        .createPosition(PORTFOLIO.uuid, { ...INPUT_POSITION, targetWeight: 101 }))
        .rejects
        .toThrow(ValidationError);
    });

    test('a position should be unique for the portfolio/company', async () => {
      await expect(PositionsService.createPosition(PORTFOLIO.uuid, INPUT_POSITION))
        .rejects
        .toThrow(AlreadyExistError);
    });

    test('should return the created position', async () => {
      const companyUuid = faker.datatype.uuid();

      CompaniesRepository.findBySymbol = jest.fn()
        .mockReturnValue({ ...COMPANY, uuid: companyUuid });

      PositionsRepository.findByCompanyUuidAndPortfolioUuid = jest.fn().mockReturnValue([]);
      PositionsRepository.createPosition = jest.fn();

      const result = await PositionsService.createPosition(PORTFOLIO.uuid, INPUT_POSITION);

      expect(result).toContainEntries([
        ['targetWeight', INPUT_POSITION.targetWeight],
        ['shares', INPUT_POSITION.shares],
        ['symbol', INPUT_POSITION.symbol],
        ['companyUuid', companyUuid],
      ]);
    });
  });

  describe('[getPositionsByPortfolioUuid]', () => {
    test('gets positions with their current state', async () => {
      CompaniesRepository.findByUuidIn = jest.fn(() => COMPANIES);
      PositionsRepository.findByPortfolioUuid = jest.fn(() => POSITIONS);

      CompanyStatesRepository.getLastByCompanyUuid = jest.fn()
        .mockReturnValueOnce(COMPANY_STATES[0])
        .mockReturnValueOnce(COMPANY_STATES[1]);

      const positions = await PositionsService.getPositionsByPortfolioUuid(faker.datatype.uuid());

      expect(positions[0]).toContainEntries([
        ['targetWeight', 60],
        ['shares', 4],
        ['companyUuid', COMPANIES[0].uuid],
        ['companyName', COMPANIES[0].name],
        ['value', 504.88],
        ['currentWeight', expect.closeTo(56.46, 2)],
        ['deltaWeight', expect.closeTo(-0.059, 3)],
      ]);

      expect(positions[1]).toContainEntries([
        ['targetWeight', 40],
        ['shares', 5],
        ['companyUuid', COMPANIES[1].uuid],
        ['companyName', COMPANIES[1].name],
        ['value', 389.35],
        ['currentWeight', expect.closeTo(43.54, 2)],
        ['deltaWeight', expect.closeTo(0.0885, 3)],
      ]);
    });

    test('throws an error when a position has an invalid company associated', async () => {
      PositionsRepository.findByPortfolioUuid = jest.fn(() => POSITIONS);
      CompaniesRepository.findByUuidIn = jest.fn(() => [COMPANIES[0]]);

      await expect(PositionsService.getPositionsByPortfolioUuid(faker.datatype.uuid()))
        .rejects
        .toThrow(`Invalid company for position: ${POSITIONS[1].uuid}`);
    });
  });
});
