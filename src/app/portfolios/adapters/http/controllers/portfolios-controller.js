const { StatusCodes } = require('http-status-codes');

const {
  createPortfolio,
  createPosition,
  deletePosition,
  getPortfolios,
  getPortfolio,
  updatePosition,
} = require('../../../domain/use-cases');

const { mapError } = require('../../../../shared/adapters/http/error-mapper');

const getPortfolioCtl = async (req, res) => {
  try {
    const { context } = req;
    const { uuid } = req.params;
    const portfolio = await getPortfolio(context, uuid);
    res.send(portfolio);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const getPortfoliosCtl = async (req, res) => {
  const { context } = req;
  const portfolios = await getPortfolios(context);
  res.send(portfolios);
};

const createPortfolioCtl = async (req, res) => {
  try {
    const { context } = req;
    const input = req.body;
    const portfolio = await createPortfolio(context, input);
    res.code(StatusCodes.CREATED).send(portfolio);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const createPositionCtl = async (req, res) => {
  try {
    const { uuid: portfolioUuid } = req.params;
    const { context } = req;
    const input = req.body;
    const position = await createPosition(context, portfolioUuid, input);
    res.code(StatusCodes.CREATED).send(position);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const deletePositionCtl = async (req, res) => {
  try {
    const { context } = req;
    const { uuid: portfolioUuid, positionUuid } = req.params;
    await deletePosition(context, portfolioUuid, positionUuid);
    res.code(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const updatePositionCtl = async (req, res) => {
  try {
    const { uuid: portfolioUuid } = req.params;
    const { context } = req;
    const input = req.body;
    const position = await updatePosition(context, portfolioUuid, input);
    res.code(StatusCodes.OK).send(position);
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
  updatePositionCtl,
};
