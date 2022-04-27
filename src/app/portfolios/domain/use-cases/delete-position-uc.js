const { PositionsRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async uuid => {
  const position = await PositionsRepository.findByUuid(uuid);

  if (!position) {
    throw new NotFoundError(`Position with uuid ${uuid} not found`);
  }

  return PositionsRepository.deleteById(position._id);
};
