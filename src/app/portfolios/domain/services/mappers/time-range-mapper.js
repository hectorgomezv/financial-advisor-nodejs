const { isString } = require('lodash');

const YEAR = 'year';
const MONTH = 'month';
const WEEK = 'week';

const from = rangeStr => {
  if (isString(rangeStr) && rangeStr.toLowerCase() === YEAR) {
    return YEAR;
  }

  if (isString(rangeStr) && rangeStr.toLowerCase() === MONTH) {
    return MONTH;
  }

  return WEEK;
};

module.exports = {
  from,
  YEAR,
  MONTH,
  WEEK,
};
