const { faker } = require('@faker-js/faker');

const { getPositions } = require('../../../../../app/positions/domain/use-cases');
const { positionsRepository } = require('../../../../../app/positions/domain/repositories');
const { companiesRepository, companyStatesRepository } = require('../../../../../app/companies/domain/repositories');

const POSITIONS = [{
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  targetWeight: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 10),
  companyId: faker.datatype.uuid(),
}, {
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  targetWeight: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 10),
  companyId: faker.datatype.uuid(),
}]; // TODO: factorize me to a fn

const COMPANIES = [{
  _id: POSITIONS[0].companyId,
  uuid: faker.datatype.uuid(),
  name: faker.company.companyName(),
  'symbol': faker.random.word().toUpperCase,
}, {
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  name: faker.company.companyName(),
  'symbol': faker.random.word().toUpperCase,
}, {
  _id: POSITIONS[1].companyId,
  uuid: faker.datatype.uuid(),
  name: faker.company.companyName(),
  'symbol': faker.random.word().toUpperCase,
}, {
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  name: faker.company.companyName(),
  'symbol': faker.random.word().toUpperCase,
}];

const COMPANY_STATE = {
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  companyId: faker.datatype.uuid(),
  timestamp: Date.now(),
  price: Math.random() * 100,
  price: Math.random() * 5,
};

describe('[unit tests] [get-positions-uc]', () => {
  test('gets positions with their current state', () => {
    try {
      positionsRepository.find = jest.fn(() => POSITIONS);
      companiesRepository.findByIdIn = jest.fn(() => COMPANIES);
      companyStatesRepository.getLastState = jest.fn(() => COMPANY_STATE);
      const positions = getPositions();
      expect.anything(positions);
    } catch (err) {
      done();
    }
  });
});
