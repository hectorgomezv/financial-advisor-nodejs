const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { Position } = require('../entities');
const { PositionsRepository, PortfoliosRepository } = require('../repositories');
const { InvalidPositionError } = require('../errors');
const { CompaniesRepository, CompanyStatesRepository } = require('../../../companies/domain/repositories');
const { NotFoundError, AlreadyExistError } = require('../../../shared/domain/errors');

const ajv = new Ajv();
const positionSchema = ajv.compile({
  type: 'object',
  properties: {
    targetWeight: { type: 'number', minimum: 0, maximum: 100 },
    shares: { type: 'number' },
    symbol: { type: 'string' },
  },
  required: ['targetWeight', 'shares', 'symbol'],
  additionalProperties: false,
});

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

const createPosition = async (portfolioUuid, data) => {
  if (!positionSchema(data)) {
    throw new ValidationError(positionSchema.errors);
  }

  const portfolio = await PortfoliosRepository.findByUuid(portfolioUuid);
  const company = await CompaniesRepository.findBySymbol(data.symbol);

  if (!portfolio || !company) {
    throw new NotFoundError('Invalid reference for position');
  }

  const position = new Position(
    portfolio.uuid,
    data.targetWeight,
    data.shares,
    company.uuid,
    company.symbol,
  );

  const currentPositions = await PositionsRepository
    .findByCompanyUuidAndPortfolioUuid(position.companyUuid, position.portfolioUuid);

  if (currentPositions.length) {
    throw new AlreadyExistError(`Position for company ${data.symbol} and portfolio ${portfolio.name} already exists`);
  }

  await PositionsRepository.createPosition(position);

  return position;
};

const getPositionsByPortfolioUuid = async portfolioUuid => {
  const positions = await PositionsRepository.findByPortfolioUuid(portfolioUuid);
  const companies = await CompaniesRepository.findByUuidIn(positions.map(p => p.companyUuid));

  const positionStates = await Promise.all(positions.map(async position => {
    const company = companies.find(c => (c.uuid === position.companyUuid));

    if (!company) {
      throw new InvalidPositionError(`Invalid company for position: ${position.uuid}`);
    }

    const companyState = await CompanyStatesRepository.getLastByCompanyUuid(company.uuid);

    return calculatePositionState(position, company, companyState);
  }));

  return addWeights(positionStates);
};

module.exports = {
  createPosition,
  getPositionsByPortfolioUuid,
};
