const { MONTH, YEAR } = require('../services/mappers/time-range-mapper');

let collection;

const init = async db => {
  collection = db.collection('portfolioStates');
};

const getGroupingForRange = range => {
  if (range === YEAR) {
    return {
      year: { $year: '$parsedDate' },
      week: { $week: '$parsedDate' },
    };
  }

  if (range === MONTH) {
    return {
      year: { $year: '$parsedDate' },
      day: { $dayOfYear: '$parsedDate' },
    };
  }

  return {
    year: { $year: '$parsedDate' },
    day: { $dayOfYear: '$parsedDate' },
    hour: { $hour: '$parsedDate' },
  };
};

const getRangeStartTimestamp = range => {
  if (range === YEAR) {
    return Date.now() - (365 * 24 * 60 * 60 * 1000);
  }

  if (range === MONTH) {
    return Date.now() - (30 * 24 * 60 * 60 * 1000);
  }

  return Date.now() - (7 * 24 * 60 * 60 * 1000);
};

const createPortfolioState = data => collection.insertOne(data);
const deleteAllByPortfolioUuid = portfolioUuid => collection.deleteMany({ portfolioUuid });

const getSeriesForRange = (portfolioUuid, range) => {
  const pipeline = [
    { $match: { portfolioUuid, timestamp: { $gte: getRangeStartTimestamp(range) } } },
    { $addFields: { parsedDate: { $toDate: '$timestamp' } } },
    {
      $group: {
        _id: getGroupingForRange(range),
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
  getSeriesForRange,
  getLastByPortfolioUuid,
  init,
};
