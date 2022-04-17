const { getCompanies } = require('../../domain/use-cases/companies');

const getCompaniesCtl = async (req, res) => {
  const companies = getCompanies();
  res.send(companies);
};

module.exports = {
  getCompaniesCtl,
};
