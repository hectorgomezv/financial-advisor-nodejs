const { PortfoliosService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  const { auth: { id: ownerId } } = context;
  await RbacService.isUserAllowedTo(context, 'read', 'portfolio');

  return PortfoliosService.getPortfolioMetricsByUuidAndOwnerId(uuid, ownerId);
};
