const { PortfoliosRepository } = require('../repositories');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async context => {
  await RbacService.isUserAllowedTo(context, 'read', 'portfolio');
  return PortfoliosRepository.findAll();
};
