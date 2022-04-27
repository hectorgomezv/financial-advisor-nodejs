const createPortfolio = require('./create-portfolio-uc');
const getPortfolio = require('./get-portfolio-uc');
const getPortfolios = require('./get-portfolios-uc');
const deletePosition = require('./delete-position-uc');
const createPosition = require('./create-position-uc');

module.exports = {
  createPortfolio,
  createPosition,
  deletePosition,
  getPortfolio,
  getPortfolios,
};
