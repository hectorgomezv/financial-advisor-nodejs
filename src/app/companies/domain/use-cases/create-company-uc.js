const { CompaniesService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, input) => {
  await RbacService.isUserAllowedTo(context, 'create', 'company');
  const company = await CompaniesService.createCompany(input);

  return company;
};
