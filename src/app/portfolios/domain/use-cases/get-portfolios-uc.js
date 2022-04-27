const { PortfoliosRepository } = require('../repositories');

module.exports = () => PortfoliosRepository.findAll();
