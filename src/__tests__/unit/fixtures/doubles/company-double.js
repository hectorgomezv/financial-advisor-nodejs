const { faker } = require('@faker-js/faker');

const buildCompany = (companyId) => ({
  _id: companyId,
  uuid: faker.datatype.uuid(),
  name: faker.company.companyName(),
  symbol: faker.random.word().toUpperCase(),
});

module.exports = {
  buildCompany,
};
