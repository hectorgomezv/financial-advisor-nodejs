const { positionsRepository } = require('../repositories');

const getPositions = async () => positionsRepository.find();

module.exports = getPositions;
