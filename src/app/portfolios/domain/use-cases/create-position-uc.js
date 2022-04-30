const { PositionsService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, portfolioUuid, input) => {
  await RbacService.isUserAllowedTo(context, 'create', 'portfolio');

  return PositionsService.createPosition(portfolioUuid, input);
};
