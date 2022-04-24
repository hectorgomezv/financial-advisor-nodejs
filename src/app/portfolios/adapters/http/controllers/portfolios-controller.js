const { getPortfolios, getPortfolio } = require('../../../domain/use-cases');

const getPortfolioCtl = async (req, res) => {
  const { uuid } = req.params;
  const portfolio = await getPortfolio(uuid);
  res.send(portfolio);
};

const getPortfoliosCtl = async (req, res) => {
  const portfolios = await getPortfolios();
  res.send(portfolios);
};

module.exports = {
  getPortfolioCtl,
  getPortfoliosCtl,
};
