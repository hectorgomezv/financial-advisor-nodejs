const PortfoliosController = require('../controllers/portfolios-controller');
const { portfolioSerializer, portfolioMetricSerializer, positionSerializer } = require('../serializers');
const { authDecorator } = require('../../../../shared/adapters/http/middleware');

const BASE_URL = '/api/v1/portfolios';

const portfoliosRouter = app => {
  positionSerializer.init(app);
  portfolioSerializer.init(app);
  portfolioMetricSerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    preValidation: authDecorator.addAuthHeader,
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
    preValidation: authDecorator.addAuthHeader,
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
    method: 'GET',
    url: `${BASE_URL}/:uuid/metrics`,
    preValidation: authDecorator.addAuthHeader,
    handler: PortfoliosController.getPortfolioMetricsCtl,
    schema: {
      response: {
        200: {
          type: 'array',
          items: { $ref: 'portfolioMetricSchema' },
        },
      },
    },
  });

  app.route({
    method: 'POST',
    url: BASE_URL,
    preValidation: authDecorator.addAuthHeader,
    handler: PortfoliosController.createPortfolioCtl,
    schema: {
      response: {
        201: {
          $ref: 'portfolioSchema',
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

  app.route({
    method: 'DELETE',
    url: `${BASE_URL}/:uuid`,
    preValidation: authDecorator.addAuthHeader,
    handler: PortfoliosController.deletePortfolioCtl,
    schema: {
      response: {
        204: {},
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

  app.route({
    method: 'POST',
    url: `${BASE_URL}/:uuid/positions`,
    preValidation: authDecorator.addAuthHeader,
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

  app.route({
    method: 'PUT',
    url: `${BASE_URL}/:uuid/positions`,
    preValidation: authDecorator.addAuthHeader,
    handler: PortfoliosController.updatePositionCtl,
    schema: {
      response: {
        200: {
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

  app.route({
    method: 'DELETE',
    url: `${BASE_URL}/:uuid/positions/:positionUuid`,
    preValidation: authDecorator.addAuthHeader,
    handler: PortfoliosController.deletePositionCtl,
    schema: {
      response: {
        204: {},
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
