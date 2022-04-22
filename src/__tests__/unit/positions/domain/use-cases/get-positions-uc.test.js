const { faker } = require('@faker-js/faker');
const { range } = require('lodash');
const matchers = require('jest-extended');

const { buildCompany, buildCompanyState, buildPosition } = require('../../../fixtures/doubles');
const { getPositions } = require('../../../../../app/positions/domain/use-cases');
const { positionsRepository } = require('../../../../../app/positions/domain/repositories');
const { companiesRepository, companyStatesRepository } = require('../../../../../app/companies/domain/repositories');

expect.extend(matchers);

const COMPANY_IDS = range(4).map(i => faker.datatype.uuid());
const COMPANIES = COMPANY_IDS.map(id => buildCompany(id));

const POSITIONS = [
  buildPosition(COMPANIES[0]._id, 4, 60),
  buildPosition(COMPANIES[1]._id, 5, 40),
];

const COMPANY_STATES = [
  buildCompanyState(COMPANIES[0]._id, 126.22),
  buildCompanyState(COMPANIES[1]._id, 77.87),
]

describe('[unit tests] [get-positions-uc]', () => {
  test('gets positions with their current state', async () => {
    positionsRepository.find = jest.fn(() => POSITIONS);
    companiesRepository.findByIdIn = jest.fn(() => COMPANIES);

    companyStatesRepository.getLastState = jest.fn()
      .mockReturnValueOnce(COMPANY_STATES[0])
      .mockReturnValueOnce(COMPANY_STATES[1]);

    const positions = await getPositions();

    expect(positions[0]).toContainEntries([
      ['targetWeight', 60],
      ['shares', 4],
      ['companyId', COMPANY_IDS[0]],
      ['companyName', COMPANIES[0].name],
      ['value', 504.88],
      ['currentWeight', expect.closeTo(56.46, 2)],
      ['deltaWeight', expect.closeTo(-0.059, 3)],
    ]);

    expect(positions[1]).toContainEntries([
      ['targetWeight', 40],
      ['shares', 5],
      ['companyId', COMPANY_IDS[1]],
      ['companyName', COMPANIES[1].name],
      ['value', 389.35],
      ['currentWeight', expect.closeTo(43.54, 2)],
      ['deltaWeight', expect.closeTo(0.0885, 3)],
    ]);
  });

  test('throws an error when a position has an invalid company associated', async () => {
    positionsRepository.find = jest.fn(() => POSITIONS);
    companiesRepository.findByIdIn = jest.fn(() => [COMPANIES[0]]);

    await expect(getPositions()).rejects.toThrow(`Invalid company for position: ${POSITIONS[1].uuid}`);
  });
});
