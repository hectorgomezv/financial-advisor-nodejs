const { v4: uuidv4 } = require('uuid');

const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');

let collection;

const init = async db => {
  collection = db.collection('companyStates');
};

const parseState = (companyUuid, data) => ({
  uuid: uuidv4(),
  companyUuid,
  timestamp: Date.now(),
  price: Number(data.summaryDetail.ask.raw),
  peg: Number(data.defaultKeyStatistics.pegRatio.raw),
});

const refreshCompanyState = async ({ uuid: companyUuid, symbol }) => {
  const { data } = await yahooFinanceClient.getQuoteSummary(symbol);
  await collection.insertOne(parseState(companyUuid, data));
};

const getLastState = async companyUuid => collection.findOne(
  { companyUuid },
  { sort: { timestamp: -1 }, limit: 1 },
);

// TODO: implement this using aggregation pipeline and use it in companies-service
// const getLastStatesByCompanyUuids = async companyUuids => ...

module.exports = {
  getLastState,
  init,
  refreshCompanyState,
};
