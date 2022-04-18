const { yahooFinanceClient } = require('../../../../infrastructure/datasources/http');
const logger = require('../../../../infrastructure/logger');

const pickData = async () => {
  const res = await yahooFinanceClient.getQuoteSummary('AAPL');
  logger.info(res.data.summaryDetail.forwardPE);
};

setInterval(() => pickData(), 1000);
