const { PortfoliosService, PortfolioStatesService, PositionsService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  const { auth: { id: ownerId } } = context;
  await RbacService.isUserAllowedTo(context, 'delete', 'portfolio');
  await PortfoliosService.deletePortfolioByUuidAndOwnerId(uuid, ownerId);
  await PortfolioStatesService.deleteAllByPortfolioUuid(uuid);

  return PositionsService.deletePositionsByPortfolioUuid(uuid);
};
