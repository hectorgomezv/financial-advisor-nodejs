const createCompany = require('./create-company-uc');
const deleteCompany = require('./delete-company-uc');
const findCompanyBySymbol = require('./find-company-by-symbol-uc');
const getCompanies = require('./get-companies-uc');
const getCompany = require('./get-company-uc');

module.exports = {
  createCompany,
  deleteCompany,
  findCompanyBySymbol,
  getCompanies,
  getCompany,
};
