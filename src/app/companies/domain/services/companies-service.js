const { CompaniesRepository, CompanyStatesRepository } = require('../repositories');

const getCompaniesWithLastState = async uuids => {
  const companies = await CompaniesRepository.findByUuidIn(uuids);
  const promises = companies.map(c => CompanyStatesRepository.getLastState(c.uuid));
  const states = await Promise.all(promises);

  return companies.map(company => ({
    ...company,
    state: { ...states.find(s => s.companyUuid === company.uuid) },
  }));
};

module.exports = {
  getCompaniesWithLastState,
};
