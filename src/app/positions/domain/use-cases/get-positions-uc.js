const { InvalidPositionError } = require('../errors');
const { PositionsRepository } = require('../repositories');
const { CompaniesRepository, CompanyStatesRepository } = require('../../../companies/domain/repositories');

const calculatePositionState = (position, company, companyState) => ({
  ...position,
  companyName: company.name,
  symbol: company.symbol,
  value: Number(companyState.price * position.shares),
});

const addWeights = positionsStates => {
  const totalValue = positionsStates.reduce((sum, it) => sum + it.value, 0);

  return positionsStates.map(positionState => {
    const { targetWeight, value } = positionState;
    const currentWeight = Number((value / totalValue) * 100);
    const deltaWeight = Number((currentWeight - targetWeight) / targetWeight);

    return {
      ...positionState,
      currentWeight,
      deltaWeight,
    };
  });
};

module.exports = async () => {
  const positions = await PositionsRepository.find();
  const companies = await CompaniesRepository.findByUuidIn(positions.map(p => p.companyUuid));

  const positionStates = await Promise.all(positions.map(async position => {
    const company = companies.find(c => (c.uuid === position.companyUuid));

    if (!company) {
      throw new InvalidPositionError(`Invalid company for position: ${position.uuid}`);
    }

    const companyState = await CompanyStatesRepository.getLastState(company._id);

    return calculatePositionState(position, company, companyState);
  }));

  return addWeights(positionStates);
};
