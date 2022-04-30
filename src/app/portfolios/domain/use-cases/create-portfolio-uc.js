const { PortfoliosService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, input) => {
  const { auth: { id: ownerId } } = context;
  await RbacService.isUserAllowedTo(context, 'create', 'portfolio');

  return PortfoliosService.createPortfolio(input, ownerId);
};
