const { CompaniesService } = require('../services');

module.exports = symbol => CompaniesService.findBySymbol(symbol);
