const CompaniesController = require('../controllers/companies-controller');
const { companySerializer } = require('../serializers');
const { authDecorator } = require('../../../../shared/adapters/http/middleware');

const BASE_URL = '/api/v1/companies';

const companiesRouter = app => {
  companySerializer.init(app);

  app.route({
    method: 'GET',
    url: BASE_URL,
    preValidation: authDecorator.addAuthHeader,
    handler: CompaniesController.getCompaniesCtl,
    schema: {
      response: {
        200: {
          type: 'array',
          items: { $ref: 'companySchema' },
        },
      },
    },
  });

  app.route({
    method: 'GET',
    url: `${BASE_URL}/:uuid`,
    preValidation: authDecorator.addAuthHeader,
    handler: CompaniesController.getCompanyCtl,
    schema: {
      response: {
        200: { $ref: 'companySchema' },
      },
    },
  });

  app.route({
    method: 'POST',
    url: BASE_URL,
    preValidation: authDecorator.addAuthHeader,
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
    preValidation: authDecorator.addAuthHeader,
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
