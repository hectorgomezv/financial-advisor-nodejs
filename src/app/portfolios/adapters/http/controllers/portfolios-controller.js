const { StatusCodes } = require('http-status-codes');
const { getPortfolios, getPortfolio } = require('../../../domain/use-cases');
const { createPosition } = require('../../../../positions/domain/use-cases');
const { mapError } = require('../../../../shared/adapters/http/error-mapper');

const getPortfolioCtl = async (req, res) => {
  const { uuid } = req.params;
  const portfolio = await getPortfolio(uuid);
  res.send(portfolio);
};

const getPortfoliosCtl = async (req, res) => {
  const portfolios = await getPortfolios();
  res.send(portfolios);
};

const createPositionCtl = async (req, res) => {
  try {
    const { uuid: portfolioUuid } = req.params;
    const input = req.body;
    const position = await createPosition(portfolioUuid, input);
    res.code(StatusCodes.CREATED).send(position);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

module.exports = {
  createPositionCtl,
  getPortfolioCtl,
  getPortfoliosCtl,
};
