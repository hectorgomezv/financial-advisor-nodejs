const { v4: uuidv4 } = require('uuid');

const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');
const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('companyStates');
};

init();

const parseState = (companyId, data) => ({
  uuid: uuidv4(),
  companyId,
  timestamp: Date.now(),
  price: Number(data.summaryDetail.ask.raw),
  peg: Number(data.defaultKeyStatistics.pegRatio.raw),
});

const refreshCompanyState = async ({ _id: companyId, symbol }) => {
  const { data } = await yahooFinanceClient.getQuoteSummary(symbol);
  await collection.insertOne(parseState(companyId, data));
};

module.exports = { refreshCompanyState };
