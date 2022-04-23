const { faker } = require('@faker-js/faker');

const buildCompanyState = (companyId, price = 17.21) => ({
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  companyId,
  timestamp: Date.now(),
  price,
  peg: faker.datatype.number({ max: 10 }),
});

module.exports = {
  buildCompanyState,
};
