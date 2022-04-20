const { companiesRepository } = require('../repositories');

module.exports = () => companiesRepository.find();
