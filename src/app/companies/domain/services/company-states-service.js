const { CompanyStatesRepository } = require('../repositories');
const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');

const refreshCompanyState = async ({ uuid: companyUuid, symbol }) => {
  const companyState = await yahooFinanceClient.getQuoteSummary(symbol);
  await CompanyStatesRepository.createCompanyState({ ...companyState, companyUuid });
};

module.exports = {
  refreshCompanyState,
};
