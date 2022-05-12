const { faker } = require('@faker-js/faker');
const { CompanyStatesService } = require('../../../../../app/companies/domain/services');
const { CompanyStatesRepository } = require('../../../../../app/companies/domain/repositories');
const { yahooFinanceClient } = require('../../../../../infrastructure/datasources/http');

const COMPANY_UUID = faker.datatype.uuid();
const COMPANY_SYMBOL = faker.finance.currencyCode();

const VALID_COMPANY_STATE = {
  uuid: COMPANY_UUID,
  timestamp: Date.now(),
  price: 12.45,
  peg: 1.54,
};

const INVALID_COMPANY_STATE = {
  ...VALID_COMPANY_STATE,
  price: 0,
};

describe('[unit tests] [company-states-service]', () => {
  describe('[refreshCompanyState]', () => {
    beforeEach(() => {
      CompanyStatesRepository.createCompanyState = jest.fn();
    });

    test('should not store an invalid company state', async () => {
      yahooFinanceClient.getQuoteSummary = jest.fn().mockReturnValue(INVALID_COMPANY_STATE);

      await CompanyStatesService.refreshCompanyState({
        uuid: COMPANY_UUID,
        symbol: COMPANY_SYMBOL,
      });

      expect(CompanyStatesRepository.createCompanyState).not.toHaveBeenCalled();
    });

    test('should store a valid company state', async () => {
      yahooFinanceClient.getQuoteSummary = jest.fn().mockReturnValue(VALID_COMPANY_STATE);

      await CompanyStatesService.refreshCompanyState({
        uuid: COMPANY_UUID,
        symbol: COMPANY_SYMBOL,
      });

      expect(CompanyStatesRepository.createCompanyState).toHaveBeenCalledTimes(1);
      expect(CompanyStatesRepository.createCompanyState).toHaveBeenCalledWith({
        ...VALID_COMPANY_STATE,
        companyUuid: COMPANY_UUID,
      });
    });
  });
});
