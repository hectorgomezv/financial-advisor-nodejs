const { PortfoliosService, PositionsService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  const { auth: { id: ownerId } } = context;
  await RbacService.isUserAllowedTo(context, 'read', 'portfolio');

  const portfolio = await PortfoliosService.getPortfolioByUuidAndOwnerId(uuid, ownerId);
  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);
  const sumWeights = positions.reduce((acc, pos) => acc + pos.targetWeight, 0);
  const isValid = (sumWeights === 100);

  return {
    ...portfolio,
    positions,
    sumWeights,
    isValid,
  };
};
