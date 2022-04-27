const { CompaniesRepository } = require('../repositories');
const { CompaniesService } = require('../services');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async uuid => {
  const company = await CompaniesRepository.findByUuid(uuid);

  if (!company) {
    throw new NotFoundError(`Company ${uuid} not found`);
  }

  const [result] = await CompaniesService.getCompaniesWithLastState([uuid]);

  return result;
};
