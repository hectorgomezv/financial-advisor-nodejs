const { PortfoliosService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async context => {
  const { auth: { id } } = context;
  await RbacService.isUserAllowedTo(context, 'read', 'portfolio');
  return PortfoliosService.getPortfoliosByOwnerId(id);
};
