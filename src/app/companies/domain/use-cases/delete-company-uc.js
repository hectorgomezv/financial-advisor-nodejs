const { CompaniesRepository } = require('../repositories');
const { HasPositionsError } = require('../errors');
const { PositionsRepository } = require('../../../portfolios/domain/repositories');
const { NotFoundError } = require('../../../shared/domain/errors');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, uuid) => {
  await RbacService.isUserAllowedTo(context, 'delete', 'company');
  const company = await CompaniesRepository.findByUuid(uuid);

  if (!company) {
    throw new NotFoundError(`Company with uuid ${uuid} not found`);
  }

  const positions = await PositionsRepository.findByCompanyUuid(company.uuid);

  if (positions.length) {
    throw new HasPositionsError(`Company ${company.name} has ${positions.length} positions associated`);
  }

  return CompaniesRepository.deleteById(company._id);
};
