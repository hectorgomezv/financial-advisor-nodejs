const { CronJob } = require('cron');
const { PortfoliosService, PortfolioStatesService, PositionsService } = require('../services');

const TEN_SECONDS_MS = 10 * 1000;
const MARKET_OPEN_CRON_EXP = '0 34 15 * * *';
const MIDDAY_CRON_EXP = '0 32 18 * * *';
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

  [MARKET_OPEN_CRON_EXP, MIDDAY_CRON_EXP, MARKET_CLOSE_CRON_EXP]
    .map(exp => new CronJob(exp, () => refreshPortfolioStates(), null, false, 'Europe/Madrid'))
    .map(job => job.start());
};

module.exports = { run };
