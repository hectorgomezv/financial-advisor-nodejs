const { PortfoliosService, PositionsService } = require('../services');
const { RbacService } = require('../../../shared/domain/services');
const { getFx } = require('../../../../infrastructure/datasources/http/currency-exchange-client');

const getTotalValueEUR = async positions => {
  const fx = await getFx();
  const totalValueUSD = positions.reduce((acc, pos) => acc + pos.value, 0);

  return fx(totalValueUSD).from('USD').to('EUR');
};

module.exports = async (context, uuid) => {
  const { auth: { id: ownerId } } = context;
  await RbacService.isUserAllowedTo(context, 'read', 'portfolio');

  const portfolio = await PortfoliosService.getPortfolioByUuidAndOwnerId(uuid, ownerId);
  const positions = await PositionsService.getPositionsByPortfolioUuid(uuid);
  const sumWeights = positions.reduce((acc, pos) => acc + pos.targetWeight, 0);
  const isValid = (sumWeights === 100);
  const totalValueEUR = await getTotalValueEUR(positions);

  return {
    ...portfolio,
    positions,
    sumWeights,
    isValid,
    totalValueEUR,
  };
};
