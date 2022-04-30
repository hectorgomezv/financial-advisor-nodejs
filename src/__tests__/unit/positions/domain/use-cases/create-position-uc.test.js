const { createPosition } = require('../../../../../app/portfolios/domain/use-cases');
const { PositionsService } = require('../../../../../app/portfolios/domain/services');
const { RbacService } = require('../../../../../app/shared/domain/services');

describe('[unit tests] [create-position-uc]', () => {
  test('permissions', () => {
    PositionsService.createPosition = jest.fn();
    RbacService.isUserAllowedTo = jest.fn().mockReturnValue(true);

    const context = {};
    createPosition(context, 'uuid', {});

    expect(RbacService.isUserAllowedTo).toHaveBeenCalledTimes(1);
    expect(RbacService.isUserAllowedTo).toHaveBeenCalledWith(context, 'create', 'portfolio');
  });
});
