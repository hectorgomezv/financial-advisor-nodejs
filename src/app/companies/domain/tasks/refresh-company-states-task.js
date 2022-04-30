const { CronJob } = require('cron');
const { CompaniesService, CompanyStatesService } = require('../services');

const FIVE_SECONDS_MS = 5 * 1000;
const MARKET_OPEN_CRON_EXP = '0 32 15 * * *';
const MARKET_CLOSE_CRON_EXP = '0 02 22 * * *';

const refreshCompanyStates = async () => {
  const companies = await CompaniesService.getAll();
  await Promise.all(companies.map(c => CompanyStatesService.refreshCompanyState(c)));
};

const run = () => {
  setTimeout(() => refreshCompanyStates(), FIVE_SECONDS_MS);

  const jobs = [
    new CronJob(MARKET_OPEN_CRON_EXP, () => refreshCompanyStates(), null, false, 'Europe/Madrid'),
    new CronJob(MARKET_CLOSE_CRON_EXP, () => refreshCompanyStates(), null, false, 'Europe/Madrid'),
  ];

  jobs.map(j => j.start());
};

module.exports = { run };
