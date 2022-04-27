const { CompaniesRepository } = require('../repositories');
const { CompaniesService } = require('../services');
const { NotFoundError } = require('../../../shared/domain/errors');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  const company = await CompaniesRepository.findByUuid(uuid);
  await RbacService.isUserAllowedTo(context, 'read', 'company');

  if (!company) {
    throw new NotFoundError(`Company ${uuid} not found`);
  }

  const [result] = await CompaniesService.getCompaniesWithLastState([uuid]);

  return result;
};
