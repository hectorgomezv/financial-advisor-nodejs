const { default: axios } = require('axios');
const { v4: uuidv4 } = require('uuid');

const mapCompanyStateResponse = data => ({
  uuid: uuidv4(),
  timestamp: Date.now(),
  price: Number(data.summaryDetail.ask.raw),
  peg: Number(data.defaultKeyStatistics.pegRatio.raw),
});

const { PROVIDER_API_TOKEN, PROVIDER_BASE_URL } = process.env;

const BASE_URL = `${PROVIDER_BASE_URL}/finance/quoteSummary`;
const DEFAULT_MODULES = '?modules=summaryDetail,defaultKeyStatistics,fundOwnership,majorDirectHolders';

const getQuoteSummary = async symbol => {
  const { data } = await axios.get(
    `${BASE_URL}/${symbol}${DEFAULT_MODULES}`,
    { headers: { 'x-api-key': PROVIDER_API_TOKEN } },
  );

  return mapCompanyStateResponse(data.quoteSummary.result[0]);
};

module.exports = { getQuoteSummary };
