const { PortfoliosService, PositionsService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async (context, portfolioUuid, input) => {
  const { auth: { id: userId } } = context;

  await RbacService.isUserAllowedTo(context, 'update', 'portfolio');
  const portfolio = await PortfoliosService.getPortfolioByUuidAndOwnerId(portfolioUuid, userId);

  if (!portfolio) {
    throw new NotFoundError(`Portfolio ${portfolioUuid} not found for the current user`);
  }

  return PositionsService.updatePosition(portfolioUuid, input);
};
