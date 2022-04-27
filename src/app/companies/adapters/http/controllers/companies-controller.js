const { StatusCodes } = require('http-status-codes');

const {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
} = require('../../../domain/use-cases');

const { mapError } = require('../../../../shared/adapters/http/error-mapper');

const getCompaniesCtl = async (req, res) => {
  const { context } = req;
  const companies = await getCompanies(context);
  res.code(StatusCodes.OK).send(companies);
};

const getCompanyCtl = async (req, res) => {
  try {
    const { context } = req;
    const { uuid } = req.params;
    const company = await getCompany(context, uuid);
    res.send(company);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const createCompanyCtl = async (req, res) => {
  try {
    const { context } = req;
    const company = await createCompany(context, req.body);
    res.code(StatusCodes.CREATED).send(company);
  } catch (err) {
    const error = mapError(err);
    res.code(error.status).send(error);
  }
};

const deleteCompanyCtl = async (req, res) => {
  try {
    const { context } = req;
    const { uuid } = req.params;
    await deleteCompany(context, uuid);
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
  getCompanyCtl,
};
