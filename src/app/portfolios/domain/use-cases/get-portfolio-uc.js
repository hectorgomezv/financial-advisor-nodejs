const { PortfoliosRepository } = require('../repositories');
const PositionsService = require('../services/positions-service');
const { NotFoundError } = require('../../../shared/domain/errors');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  await RbacService.isUserAllowedTo(context, 'read', 'portfolio');
  const portfolio = await PortfoliosRepository.findByUuid(uuid);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${uuid} not found`);
  }

  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);
  const isValid = (positions.reduce((acc, pos) => acc + pos.targetWeight, 0) === 100);

  return { ...portfolio, positions, isValid };
};
