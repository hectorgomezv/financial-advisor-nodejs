const { CronJob } = require('cron');
const { CompaniesService, CompanyStatesService } = require('../services');
const { logger } = require('../../../../infrastructure');

const FIVE_SECONDS_MS = 5 * 1000;
const MARKET_OPEN_CRON_EXP = '0 32 15 * * *';
const MIDDAY_CRON_EXP = '0 30 18 * * *';
const MARKET_CLOSE_CRON_EXP = '0 02 22 * * *';

const refreshCompanyStates = async () => {
  try {
    const companies = await CompaniesService.getAll();
    await Promise.all(companies.map(c => CompanyStatesService.refreshCompanyState(c)));
  } catch (err) {
    logger.error(`Error refreshing companies state from provider: ${err.message}`);
  }
};

const run = () => {
  setTimeout(() => refreshCompanyStates(), FIVE_SECONDS_MS);

  [MARKET_OPEN_CRON_EXP, MIDDAY_CRON_EXP, MARKET_CLOSE_CRON_EXP]
    .map(exp => new CronJob(exp, () => refreshCompanyStates(), null, false, 'Europe/Madrid'))
    .map(job => job.start());
};

module.exports = { run };
