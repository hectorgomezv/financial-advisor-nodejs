const { PositionsRepository } = require('../repositories');
const { NotFoundError } = require('../../../shared/domain/errors');
const { RbacService } = require('../../../shared/domain/services');

module.exports = async (context, portfolioUuid, positionUuid) => {
  await RbacService.isUserAllowedTo(context, 'delete', 'portfolio');
  // TODO: check the portfolio is owned by the user in the context
  const position = await PositionsRepository.findByUuid(positionUuid);

  if (!position) {
    throw new NotFoundError(`Position ${positionUuid} not found`);
  }

  return PositionsRepository.deleteById(position._id);
};
