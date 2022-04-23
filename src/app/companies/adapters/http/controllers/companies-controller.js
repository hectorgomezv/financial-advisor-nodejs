const { StatusCodes } = require('http-status-codes');

const { createCompany, deleteCompany, getCompanies } = require('../../../domain/use-cases');
const { mapError } = require('../../../../shared/adapters/http/error-mapper');

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

const deleteCompanyCtl = async (req, res) => {
  try {
    const { uuid } = req.params;
    await deleteCompany(uuid);
    res.code(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

module.exports = {
  createCompanyCtl,
  deleteCompanyCtl,
  getCompaniesCtl,
};
