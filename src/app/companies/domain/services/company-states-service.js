const { CompanyStatesRepository } = require('../repositories');
const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');
const { logger } = require('../../../../infrastructure');

const isValidCompanyState = companyState => !!companyState.price;

const refreshCompanyState = async ({ uuid: companyUuid, symbol }) => {
  const companyState = await yahooFinanceClient.getQuoteSummary(symbol);

  if (!isValidCompanyState(companyState)) {
    return logger.error(`Malformed company state received: ${companyState}`);
  }

  return CompanyStatesRepository.createCompanyState({ ...companyState, companyUuid });
};

module.exports = {
  refreshCompanyState,
};
