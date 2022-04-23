const { companiesRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async symbol => {
  const company = await companiesRepository.findBySymbol(symbol);

  if (!company) {
    throw new NotFoundError(`Company with symbol ${symbol} not found`);
  }

  return company;
};
