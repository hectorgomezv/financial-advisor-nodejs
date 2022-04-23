const { StatusCodes } = require('http-status-codes');

const { mapError } = require('../../../../shared/adapters/http/error-mapper');
const { createCompany, getCompanies } = require('../../../domain/use-cases');

const getCompaniesCtl = async (req, res) => {
  const companies = await getCompanies();
  res.code(StatusCodes.OK).send(companies);
};

const createCompanyCtl = async (req, res) => {
  try {
    const company = await createCompany(req.body);
    res.code(StatusCodes.CREATED).send(company);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

module.exports = {
  createCompanyCtl,
  getCompaniesCtl,
};
