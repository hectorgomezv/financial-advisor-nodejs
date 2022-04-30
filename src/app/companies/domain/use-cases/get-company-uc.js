const { CompaniesService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  await RbacService.isUserAllowedTo(context, 'read', 'company');
  await CompaniesService.findByUuid(uuid);
  const [result] = await CompaniesService.getCompaniesWithLastState([uuid]);

  return result;
};
