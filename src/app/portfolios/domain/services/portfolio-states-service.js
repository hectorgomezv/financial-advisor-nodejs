const { PortfolioStatesRepository } = require('../repositories');
const { getFx } = require('../../../../infrastructure/datasources/http/currency-exchange-client');
const PortfolioState = require('../entities/portfolio-state');

const getTotalValueEUR = async positions => {
  const fx = await getFx();
  const totalValueUSD = positions.reduce((acc, pos) => acc + pos.value, 0);

  return fx(totalValueUSD).from('USD').to('EUR');
};

const createPortfolioState = async (portfolioUuid, positions) => {
  const sumWeights = positions.reduce((acc, pos) => acc + pos.targetWeight, 0);
  const isValid = (sumWeights === 100);
  const totalValueEUR = await getTotalValueEUR(positions);
  const portfolioState = new PortfolioState(portfolioUuid, isValid, sumWeights, totalValueEUR);

  return PortfolioStatesRepository.createPortfolioState(portfolioState);
};

const deleteAllByPortfolioUuid = portfolioUuid => PortfolioStatesRepository
  .deleteAllByPortfolioUuid(portfolioUuid);

const getLastByPortfolioUuid = portfolioUuid => PortfolioStatesRepository
  .getLastByPortfolioUuid(portfolioUuid);

module.exports = {
  createPortfolioState,
  deleteAllByPortfolioUuid,
  getLastByPortfolioUuid,
};
