const { faker } = require('@faker-js/faker');
const matchers = require('jest-extended');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { createPosition } = require('../../../../../app/positions/domain/use-cases');
const { CompaniesRepository } = require('../../../../../app/companies/domain/repositories');
const { NotFoundError, AlreadyExistError } = require('../../../../../app/shared/domain/errors');
const Company = require('../../../../../app/companies/domain/entities/company');
const { PositionsRepository } = require('../../../../../app/positions/domain/repositories');
const Position = require('../../../../../app/positions/domain/entities/position');

expect.extend(matchers);

const INPUT_POSITION = {
  targetWeight: faker.datatype.number({ max: 100 }),
  shares: 10,
  symbol: 'AAPL',
};

const COMPANY = new Company('Apple Inc.', 'AAPL');
const CURRENT_POSITIONS = [new Position(faker.datatype.number({ max: 100 }), 10, 'AAPL')];

describe('[unit tests] [create-position-uc]', () => {
  test('targetWeight should between 0 and 100', async () => {
    await expect(createPosition({ ...INPUT_POSITION, targetWeight: -3 }))
      .rejects
      .toThrow(ValidationError);

    await expect(createPosition({ ...INPUT_POSITION, targetWeight: 101 }))
      .rejects
      .toThrow(ValidationError);
  });

  test('the symbol provided should belong to a known company', async () => {
    CompaniesRepository.findBySymbol = jest.fn().mockReturnValue(null);
    await expect(createPosition(INPUT_POSITION)).rejects.toThrow(NotFoundError);
  });

  test('a position for the company should be unique', async () => {
    CompaniesRepository.findBySymbol = jest.fn().mockReturnValue(COMPANY);
    PositionsRepository.findByCompanyUuid = jest.fn().mockReturnValue(CURRENT_POSITIONS);
    await expect(createPosition(INPUT_POSITION)).rejects.toThrow(AlreadyExistError);
  });

  test('should return the created position', async () => {
    const companyUuid = faker.datatype.uuid();
    CompaniesRepository.findBySymbol = jest.fn().mockReturnValue({ ...COMPANY, uuid: companyUuid });
    PositionsRepository.findByCompanyUuid = jest.fn().mockReturnValue([]);
    PositionsRepository.createPosition = jest.fn();

    const result = await createPosition(INPUT_POSITION);

    expect(result).toContainEntries([
      ['targetWeight', INPUT_POSITION.targetWeight],
      ['shares', INPUT_POSITION.shares],
      ['symbol', INPUT_POSITION.symbol],
      ['companyUuid', companyUuid],
    ]);
  });
});
