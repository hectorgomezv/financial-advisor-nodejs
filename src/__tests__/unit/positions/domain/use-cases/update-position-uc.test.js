const { faker } = require('@faker-js/faker');
const { updatePosition } = require('../../../../../app/portfolios/domain/use-cases');
const { PortfoliosService, PositionsService } = require('../../../../../app/portfolios/domain/services');
const { RbacService } = require('../../../../../app/shared/domain/services');
const { NotFoundError } = require('../../../../../app/shared/domain/errors');
const { Portfolio } = require('../../../../../app/portfolios/domain/entities');

const USER_ID = faker.datatype.uuid();
const CONTEXT = { auth: { id: USER_ID } };
const PORTFOLIO = new Portfolio(faker.name.firstName(), USER_ID);

describe('[unit tests] [create-position-uc]', () => {
  test('permissions on not found item', async () => {
    PositionsService.updatePosition = jest.fn();
    RbacService.isUserAllowedTo = jest.fn().mockReturnValue(true);
    PortfoliosService.getPortfolioByUuidAndOwnerId = jest.fn().mockReturnValue(null);

    await expect(updatePosition(CONTEXT, 'uuid', {})).rejects.toThrow(NotFoundError);
    expect(RbacService.isUserAllowedTo).toHaveBeenCalledTimes(1);
    expect(RbacService.isUserAllowedTo).toHaveBeenCalledWith(CONTEXT, 'update', 'portfolio');
  });

  test('permissions on item', async () => {
    PositionsService.updatePosition = jest.fn();
    RbacService.isUserAllowedTo = jest.fn().mockReturnValue(true);
    PortfoliosService.getPortfolioByUuidAndOwnerId = jest.fn().mockReturnValue(PORTFOLIO);

    await updatePosition(CONTEXT, 'uuid', {});
    expect(RbacService.isUserAllowedTo).toHaveBeenCalledTimes(1);
    expect(RbacService.isUserAllowedTo).toHaveBeenCalledWith(CONTEXT, 'update', 'portfolio');
  });
});
