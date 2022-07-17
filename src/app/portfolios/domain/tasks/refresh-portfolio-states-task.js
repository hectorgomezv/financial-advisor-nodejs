const { CronJob } = require('cron');
const { PortfoliosService, PortfolioStatesService, PositionsService } = require('../services');

const TEN_SECONDS_MS = 10 * 1000;
const EVERY_HOUR_CRON_EXP = '0 * * * *';

const refreshPortfolioStates = async () => {
  const portfolios = await PortfoliosService.getAll();

  await Promise.all(portfolios.map(async portfolio => {
    const positions = await PositionsService.getPositionsByPortfolioUuid(portfolio.uuid);
    PortfolioStatesService.createPortfolioState(portfolio.uuid, positions);
  }));
};

const run = () => {
  setTimeout(() => refreshPortfolioStates(), TEN_SECONDS_MS);
  const job = new CronJob(EVERY_HOUR_CRON_EXP, () => refreshPortfolioStates());
  job.start();
};

module.exports = { run };
