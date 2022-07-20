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

// TODO: move this to portfolio-states-repository

const getSeriesForMonth = portfolioUuid => {
  const pipeline = [
    { $match: { portfolioUuid: '3d78a8d8-3c49-4dc1-af81-b32863a5f60e' } },
    { $addFields: { parsedDate: { $toDate: '$timestamp' } } },
    {
      $group: {
        _id: {
          year: { $year: '$parsedDate' },
          day: { $dayOfYear: '$parsedDate' },
        },
        average: { $avg: '$totalValueEUR' },
      },
    },
    { $sort: { '_id.year': 1, '_id.day': 1 } }];

  return 'unimplemented';
};

const getSeriesForYear = portfolioUuid => {
  const pipeline = [
    { $match: { portfolioUuid: '3d78a8d8-3c49-4dc1-af81-b32863a5f60e' } },
    { $addFields: { parsedDate: { $toDate: '$timestamp' } } },
    {
      $group: {
        _id: {
          year: { $year: '$parsedDate' },
          week: { $week: '$parsedDate' },
        },
        average: { $avg: '$totalValueEUR' },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } }];

  return 'unimplemented';
};

module.exports = {
  createPortfolioState,
  deleteAllByPortfolioUuid,
  getLastByPortfolioUuid,
  getSeriesForMonth,
  getSeriesForYear,
};
