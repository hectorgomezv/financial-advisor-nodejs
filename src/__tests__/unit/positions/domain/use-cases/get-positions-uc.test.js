const { faker } = require('@faker-js/faker');
const { range } = require('lodash/fp');
const matchers = require('jest-extended');

const { getPositions } = require('../../../../../app/positions/domain/use-cases');
const { PositionsRepository } = require('../../../../../app/positions/domain/repositories');
const { CompaniesRepository, CompanyStatesRepository } = require('../../../../../app/companies/domain/repositories');
const Position = require('../../../../../app/positions/domain/entities/position');
const Company = require('../../../../../app/companies/domain/entities/company');
const CompanyState = require('../../../../../app/companies/domain/entities/company-state');

expect.extend(matchers);

const COMPANIES = (range(0)(4)).map(() => new Company(
  faker.company.companyName(),
  faker.random.word().toUpperCase(),
));

const POSITIONS = [
  new Position(60, 4, COMPANIES[0].uuid, COMPANIES[0].symbol),
  new Position(40, 5, COMPANIES[1].uuid, COMPANIES[1].symbol),
];

const COMPANY_STATES = [
  new CompanyState(COMPANIES[0].uuid, 126.22, 2.34),
  new CompanyState(COMPANIES[1].uuid, 77.87, 2.34),
];

describe('[unit tests] [get-positions-uc]', () => {
  test('gets positions with their current state', async () => {
    PositionsRepository.find = jest.fn(() => POSITIONS);
    CompaniesRepository.findByUuidIn = jest.fn(() => COMPANIES);

    CompanyStatesRepository.getLastState = jest.fn()
      .mockReturnValueOnce(COMPANY_STATES[0])
      .mockReturnValueOnce(COMPANY_STATES[1]);

    const positions = await getPositions();

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
    PositionsRepository.find = jest.fn(() => POSITIONS);
    CompaniesRepository.findByUuidIn = jest.fn(() => [COMPANIES[0]]);

    await expect(getPositions()).rejects.toThrow(`Invalid company for position: ${POSITIONS[1].uuid}`);
  });
});
