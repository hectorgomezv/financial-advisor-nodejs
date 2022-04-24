const PortfoliosController = require('../controllers/portfolios-controller');
const { portfolioSerializer } = require('../serializers');

const BASE_URL = '/portfolios';

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
};

module.exports = portfoliosRouter;
