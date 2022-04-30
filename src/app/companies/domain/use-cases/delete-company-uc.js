const { RbacService } = require('../../../shared/domain/services');
const { CompaniesService } = require('../services');

module.exports = async (context, uuid) => {
  await RbacService.isUserAllowedTo(context, 'delete', 'company');

  return CompaniesService.deleteCompany(uuid);
};
