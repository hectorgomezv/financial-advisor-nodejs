const { CronJob } = require('cron');
const { PortfoliosService, PortfolioStatesService, PositionsService } = require('../services');

const TEN_SECONDS_MS = 10 * 1000;
const MARKET_OPEN_CRON_EXP = '0 34 15 * * *';
const MARKET_CLOSE_CRON_EXP = '0 04 22 * * *';

const refreshPortfolioStates = async () => {
  const portfolios = await PortfoliosService.getAll();

  await Promise.all(portfolios.map(async portfolio => {
    const positions = await PositionsService.getPositionsByPortfolioUuid(portfolio.uuid);
    PortfolioStatesService.createPortfolioState(portfolio.uuid, positions);
  }));
};

const run = () => {
  setTimeout(() => refreshPortfolioStates(), TEN_SECONDS_MS);

  const jobs = [
    new CronJob(MARKET_OPEN_CRON_EXP, () => refreshPortfolioStates(), null, false, 'Europe/Madrid'),
    new CronJob(MARKET_CLOSE_CRON_EXP, () => refreshPortfolioStates(), null, false, 'Europe/Madrid'),
  ];

  jobs.map(j => j.start());
};

module.exports = { run };
