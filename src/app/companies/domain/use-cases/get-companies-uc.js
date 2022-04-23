const { CompaniesRepository } = require('../repositories');

module.exports = () => CompaniesRepository.find();
