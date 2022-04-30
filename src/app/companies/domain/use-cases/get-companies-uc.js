const { CompaniesService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async context => {
  await RbacService.isUserAllowedTo(context, 'read', 'company');
  return CompaniesService.getAll();
};
