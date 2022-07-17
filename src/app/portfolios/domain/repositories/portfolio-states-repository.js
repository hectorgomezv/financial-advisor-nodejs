let collection;

const init = async db => {
  collection = db.collection('portfolioStates');
};

const createPortfolioState = data => collection.insertOne(data);

const getLastByPortfolioUuid = portfolioUuid => collection.findOne(
  { portfolioUuid },
  { sort: { timestamp: -1 }, limit: 1 },
);

module.exports = {
  createPortfolioState,
  getLastByPortfolioUuid,
  init,
};
