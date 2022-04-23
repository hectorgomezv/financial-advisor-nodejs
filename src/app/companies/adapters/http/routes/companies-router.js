const CompaniesController = require('../controllers/companies-controller');
const { companySerializer } = require('../serializers');

const BASE_URL = '/companies';

const companiesRouter = app => {
  companySerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    handler: CompaniesController.getCompaniesCtl,
    schema: {
      response: {
        '2xx': {
          type: 'array',
          items: { $ref: 'companySchema' },
        },
      },
    },
  });

  app.route({
    method: 'POST',
    url: BASE_URL,
    handler: CompaniesController.createCompanyCtl,
    schema: {
      response: {
        '2xx': {
          $ref: 'companySchema',
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
    handler: CompaniesController.deleteCompanyCtl,
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
