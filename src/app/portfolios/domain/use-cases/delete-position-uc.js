const { PositionsRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');

module.exports = async (portfolioUuid, positionUuid) => {
  const position = await PositionsRepository.findByUuid(positionUuid);

  if (!position) {
    throw new NotFoundError(`Position ${positionUuid} not found`);
  }

  return PositionsRepository.deleteById(position._id);
};
