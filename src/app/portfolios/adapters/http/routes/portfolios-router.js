const PortfoliosController = require('../controllers/portfolios-controller');
const { portfolioSerializer } = require('../serializers');

const BASE_URL = '/api/v1/portfolios';

const portfoliosRouter = app => {
  portfolioSerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    handler: PortfoliosController.getPortfoliosCtl,
    schema: {
      response: {
        200: {
          type: 'array',
          items: { $ref: 'portfolioSchema' },
        },
      },
    },
  });

  app.route({
    method: 'GET',
    url: `${BASE_URL}/:uuid`,
    handler: PortfoliosController.getPortfolioCtl,
    schema: {
      response: {
        200: {
          $ref: 'portfolioSchema',
        },
      },
    },
  });

  app.route({
    method: 'POST',
    url: `${BASE_URL}/:uuid/positions`,
    handler: PortfoliosController.createPositionCtl,
    schema: {
      response: {
        '2xx': {
          $ref: 'positionSchema',
        },
        400: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            reason: { type: 'string' },
          },
        },
      },
    },
  });
};

module.exports = portfoliosRouter;