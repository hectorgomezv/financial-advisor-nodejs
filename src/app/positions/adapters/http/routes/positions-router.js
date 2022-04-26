const PositionsController = require('../controllers/positions-controller');
const { positionSerializer } = require('../serializers');

const BASE_URL = '/api/v1/positions';

const companiesRouter = app => {
  positionSerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    handler: PositionsController.getPositionsCtl,
    schema: {
      response: {
        '2xx': {
          type: 'array',
          items: { $ref: 'positionSchema' },
        },
      },
    },
  });

  app.route({
    method: 'POST',
    url: BASE_URL,
    handler: PositionsController.createPositionCtl,
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
    method: 'DELETE',
    url: `${BASE_URL}/:uuid`,
    handler: PositionsController.deletePositionCtl,
    schema: {
      response: {
        201: {},
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

module.exports = companiesRouter;
