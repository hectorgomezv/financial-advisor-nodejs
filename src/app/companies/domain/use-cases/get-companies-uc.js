const { CompaniesRepository } = require('../repositories');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async context => {
  await RbacService.isUserAllowedTo(context, 'read', 'company');
  return CompaniesRepository.find();
};
