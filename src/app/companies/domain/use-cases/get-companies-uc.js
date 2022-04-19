const { companiesRepository } = require('../repositories');

const getCompanies = async () => companiesRepository.find();

module.exports = getCompanies;
