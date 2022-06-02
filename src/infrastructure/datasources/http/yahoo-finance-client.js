const { default: axios } = require('axios');
const { get } = require('lodash');
const { v4: uuidv4 } = require('uuid');

const mapCompanyStateResponse = data => {
  const {
    summaryDetail: {
      ask,
      bid,
      open,
      previousClose,
    },
  } = data;

  return {
    uuid: uuidv4(),
    timestamp: Date.now(),
    price: Number(get(ask, 'raw') || get(bid, 'raw') || get(open, 'raw') || get(previousClose, 'raw')),
    peg: Number(data.defaultKeyStatistics.pegRatio.raw),
  };
};

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
