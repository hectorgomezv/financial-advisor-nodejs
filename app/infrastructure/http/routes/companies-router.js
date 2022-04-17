const { getCompaniesCtl } = require('../../../interfaces/controllers/companies-controller');

const BASE_URL = '/companies';

const companiesRouter = (app) => {
  app.get(BASE_URL, {}, getCompaniesCtl);
};

module.exports = companiesRouter;
