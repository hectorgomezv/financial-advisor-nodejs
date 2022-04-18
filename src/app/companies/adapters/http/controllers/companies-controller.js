const { getCompanies } = require('../../../domain/use-cases');

const getCompaniesCtl = async (req, res) => {
  const companies = await getCompanies();
  res.send(companies);
};

module.exports = {
  getCompaniesCtl,
};
