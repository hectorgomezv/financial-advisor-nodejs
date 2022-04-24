const { PortfoliosRepository } = require('../repositories');
const PositionsService = require('../../../positions/domain/services/positions-service');

module.exports = async uuid => {
  const portfolio = await PortfoliosRepository.findByUuid(uuid);
  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);

  return { ...portfolio, positions, isValid: true };
};
