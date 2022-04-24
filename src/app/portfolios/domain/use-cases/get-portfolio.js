const { PortfoliosRepository } = require('../repositories');
const { PositionsRepository } = require('../../../positions/domain/repositories');

module.exports = async uuid => {
  const portfolio = await PortfoliosRepository.findByUuid(uuid);

  return portfolio;
};
