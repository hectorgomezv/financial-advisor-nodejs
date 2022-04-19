const { getPositionsCtl } = require('../controllers/positions-controller');
const { positionSerializer } = require('../serializers');

const BASE_URL = '/positions';

const companiesRouter = (app) => {
  positionSerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    handler: getPositionsCtl,
    schema: {
      response: {
        '2xx': {
          type: 'array',
          items: { $ref: 'positionSchema' },
        },
      },
    },
  });
};

module.exports = companiesRouter;
