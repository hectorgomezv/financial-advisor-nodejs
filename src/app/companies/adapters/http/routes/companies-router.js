const { getCompaniesCtl } = require('../controllers/companies-controller');
const { companySerializer } = require('../serializers');

const BASE_URL = '/companies';

const companiesRouter = app => {
  companySerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    handler: getCompaniesCtl,
    schema: {
      response: {
        '2xx': {
          type: 'array',
          items: { $ref: 'companySchema' },
        },
      },
    },
  });
};

module.exports = companiesRouter;
