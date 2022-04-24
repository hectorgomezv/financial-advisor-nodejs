const { getPortFolios } = require('../../../domain/use-cases');

const getPortfoliosCtl = async (req, res) => {
  const portfolios = await getPortFolios();
  res.send(portfolios);
};

module.exports = {
  getPortfoliosCtl,
};
