const { PortfoliosRepository } = require('../repositories');
const PositionsService = require('../services/positions-service');

module.exports = async uuid => {
  const portfolio = await PortfoliosRepository.findByUuid(uuid);
  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);

  const isValid = (positions.reduce((acc, pos) => acc + pos.targetWeight, 0) === 100);

  return { ...portfolio, positions, isValid };
};
