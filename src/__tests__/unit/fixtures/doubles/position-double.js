const { faker } = require('@faker-js/faker');

const buildPosition = (companyId, shares = 1, targetWeight = 100) => ({
  _id: faker.datatype.uuid(),
  uuid: faker.datatype.uuid(),
  targetWeight,
  shares,
  companyId,
});

module.exports = {
  buildPosition,
};
