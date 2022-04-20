const { HealthRepository } = require('../repositories');

module.exports = () => HealthRepository.getHealth();
