let collection;

const init = async db => {
  collection = db.collection('portfolioStates');
};

const createPortfolioState = data => collection.insertOne(data);
const deleteAllByPortfolioUuid = portfolioUuid => collection.deleteMany({ portfolioUuid });

const getSeriesForWeek = portfolioUuid => {
  const pipeline = [
    { $match: { portfolioUuid } },
    { $addFields: { parsedDate: { $toDate: '$timestamp' } } },
    {
      $group: {
        _id: {
          year: { $year: '$parsedDate' },
          day: { $dayOfYear: '$parsedDate' },
          hour: { $hour: '$parsedDate' },
        },
        average: { $avg: '$totalValueEUR' },
      },
    },
    { $sort: { '_id.year': 1, '_id.day': 1, '_id.hour': 1 } }];

  return collection.aggregate(pipeline).toArray();
};

const getLastByPortfolioUuid = portfolioUuid => collection.findOne(
  { portfolioUuid },
  { sort: { timestamp: -1 }, limit: 1 },
);

module.exports = {
  createPortfolioState,
  deleteAllByPortfolioUuid,
  getSeriesForWeek,
  getLastByPortfolioUuid,
  init,
};
