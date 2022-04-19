const { HealthRepository } = require('../repositories');

const getHealth = () => HealthRepository.getHealth();

module.exports = getHealth;
