const { CompaniesRepository, CompanyStatesRepository } = require('../repositories');

const FIVE_SECONDS_MS = 5 * 1000;
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

const refreshCompanyStates = async () => {
  const companies = await CompaniesRepository.find();
  await Promise.all(companies.map(c => CompanyStatesRepository.refreshCompanyState(c)));
};

const run = () => {
  setTimeout(() => refreshCompanyStates(), FIVE_SECONDS_MS);
  setInterval(() => refreshCompanyStates(), TWELVE_HOURS_MS);
};

module.exports = { run };
