const { StatusCodes } = require('http-status-codes');

const {
  // createPortfolio,
  createPosition,
  deletePosition,
  getPortfolios,
  getPortfolio,
} = require('../../../domain/use-cases');

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

// TODO: create portfolio
const createPortfolioCtl = async (req, res) => {
  try {
    const { auth } = req;
    const input = req.body;
    // const position = await createPosition(portfolioUuid, input);
    res.code(StatusCodes.CREATED).send({ auth, input });
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
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

const deletePositionCtl = async (req, res) => {
  try {
    const { uuid: portfolioUuid, positionUuid } = req.params;
    await deletePosition(portfolioUuid, positionUuid);
    res.code(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

module.exports = {
  createPortfolioCtl,
  createPositionCtl,
  deletePositionCtl,
  getPortfolioCtl,
  getPortfoliosCtl,
};
