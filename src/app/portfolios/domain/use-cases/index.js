const createPortfolio = require('./create-portfolio-uc');
const createPosition = require('./create-position-uc');
const deletePortfolio = require('./delete-portfolio-uc');
const deletePosition = require('./delete-position-uc');
const getPortfolio = require('./get-portfolio-uc');
const getPortfolioMetrics = require('./get-portfolio-metrics-uc');
const getPortfolios = require('./get-portfolios-uc');
const updatePosition = require('./update-position-uc');

module.exports = {
  createPortfolio,
  createPosition,
  deletePortfolio,
  deletePosition,
  getPortfolio,
  getPortfolioMetrics,
  getPortfolios,
  updatePosition,
};
