const getPortfolio = require('./get-portfolio-uc');
const getPortfolios = require('./get-portfolios-uc');
const deletePosition = require('./delete-position-uc');
const createPosition = require('./create-position-uc');

module.exports = {
  createPosition,
  deletePosition,
  getPortfolio,
  getPortfolios,
};
