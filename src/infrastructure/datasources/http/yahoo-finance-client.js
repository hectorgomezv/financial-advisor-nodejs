const { default: axios } = require('axios');

const { FINANCIAL_ADVISOR_PROVIDER_BASE_URL } = process.env;

const BASE_URL = `${FINANCIAL_ADVISOR_PROVIDER_BASE_URL}/finance/quoteSummary`;
const DEFAULT_MODULES = '?modules=summaryDetail,defaultKeyStatistics,fundOwnership,majorDirectHolders';

const getQuoteSummary = symbol => axios.get(`${BASE_URL}/${symbol}${DEFAULT_MODULES}`);

module.exports = { getQuoteSummary };
