const { PortfoliosRepository } = require('../repositories');
const PositionsService = require('../services/positions-service');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async uuid => {
  const portfolio = await PortfoliosRepository.findByUuid(uuid);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);
  const isValid = (positions.reduce((acc, pos) => acc + pos.targetWeight, 0) === 100);

  return { ...portfolio, positions, isValid };
};
