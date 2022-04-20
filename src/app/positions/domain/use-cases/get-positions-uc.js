const { positionsRepository } = require('../repositories');
const { companiesRepository, companyStatesRepository } = require('../../../companies/domain/repositories');

const calculatePositionState = (position, company, companyState) => ({
  ...position,
  companyName: company.name,
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
  const positions = await positionsRepository.find();
  const companies = await companiesRepository.findByIdIn(positions.map(p => p.companyId));

  const positionStates = await Promise.all(positions.map(async position => {
    const company = companies.find(c => (c._id.toString() === position.companyId.toString()));
    const companyState = await companyStatesRepository.getLastState(company._id);

    return calculatePositionState(position, company, companyState);
  }));

  return addWeights(positionStates);
};
