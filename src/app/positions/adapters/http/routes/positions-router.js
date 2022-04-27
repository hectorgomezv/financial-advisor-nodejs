const PositionsController = require('../controllers/positions-controller');
const { positionSerializer } = require('../serializers');

const BASE_URL = '/api/v1/positions';

const positionsRouter = app => {
  positionSerializer.init(app);

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

module.exports = positionsRouter;
