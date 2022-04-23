const { positionsRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async uuid => {
  const position = await positionsRepository.findByUuid(uuid);

  if (!position) {
    throw new NotFoundError(`Position with uuid ${uuid} not found`);
  }

  return positionsRepository.deleteById(position._id);
};
