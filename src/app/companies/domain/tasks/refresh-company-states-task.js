const { companiesRepository, companyStatesRepository } = require('../repositories');

const TEN_SECONDS_MS = 10 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

const refreshCompanyStates = async () => {
  const companies = await companiesRepository.find();
  await Promise.all(companies.map((c) => companyStatesRepository.refreshCompanyState(c)));
};

const run = () => {
  setTimeout(() => refreshCompanyStates(), TEN_SECONDS_MS);
  setInterval(() => refreshCompanyStates(), ONE_HOUR_MS);
};

module.exports = { run };
