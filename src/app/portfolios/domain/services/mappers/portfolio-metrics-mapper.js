const PortfolioMetric = require('../../entities/portfolio-metric');

const fromDayMetric = ({ _id, average }) => new PortfolioMetric(
  (new Date(_id.year, 0, _id.day, (_id.hour || 0))).getTime(),
  average,
);

const fromWeekMetric = ({ _id, average }) => new PortfolioMetric(
  (new Date(_id.year, 0, (1 + (_id.week - 1) * 7), 0)).getTime(),
  average,
);

const from = portfolioMetricRaw => {
  const { _id: { day } } = portfolioMetricRaw;

  return (day || day === 0)
    ? fromDayMetric(portfolioMetricRaw)
    : fromWeekMetric(portfolioMetricRaw);
};

module.exports = {
  from,
};
