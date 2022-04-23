const { companiesRepository } = require('../repositories');
const { HasPositionsError } = require('../errors');
const { positionsRepository } = require('../../../positions/domain/repositories');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async uuid => {
  const company = await companiesRepository.findByUuid(uuid);

  if (!company) {
    throw new NotFoundError(`Company with uuid ${uuid} not found`);
  }

  const positions = await positionsRepository.findByCompanyId(company._id);

  if (positions.length) {
    throw new HasPositionsError(`Company ${company.name} has ${positions.length} positions associated`);
  }

  return companiesRepository.deleteById(company._id);
};
