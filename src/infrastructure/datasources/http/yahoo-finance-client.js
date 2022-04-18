const { default: axios } = require('axios');

const BASE_URL = 'http://localhost:4000/finance/quoteSummary';
const DEFAULT_MODULES = '?modules=summaryDetail,defaultKeyStatistics,fundOwnership,majorDirectHolders';

const getQuoteSummary = async (symbol) => axios.get(`${BASE_URL}/${symbol}/${DEFAULT_MODULES}`);

module.exports = { getQuoteSummary };
