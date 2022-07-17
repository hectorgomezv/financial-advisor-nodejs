const { PortfoliosService, PortfolioStatesService, PositionsService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, portfolioUuid, positionUuid) => {
  const { auth: { id: ownerId } } = context;
  await RbacService.isUserAllowedTo(context, 'delete', 'portfolio');

  await PortfoliosService.getPortfolioByUuidAndOwnerId(portfolioUuid, ownerId);
  await PositionsService.deletePositionByPortfolioUuidAndUuid(portfolioUuid, positionUuid);
  const positions = await PositionsService.getPositionsByPortfolioUuid(portfolioUuid);
  await PortfolioStatesService.createPortfolioState(portfolioUuid, positions);
};
