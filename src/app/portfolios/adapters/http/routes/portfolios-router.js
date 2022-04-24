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
        '2xx': {
          type: 'array',
          items: { $ref: 'portfolioSchema' },
        },
      },
    },
  });
};

module.exports = portfoliosRouter;
