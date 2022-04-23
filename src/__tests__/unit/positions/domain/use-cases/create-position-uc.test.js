const { createPosition } = require('../../../../../app/positions/domain/use-cases');

describe('[unit tests] [create-position-uc]', () => {
  test('targetWeight should between 0 and 100', async () => {
    await expect(createPosition({ targetWeight: -3 })).rejects.toThrow('validation failed');
    await expect(createPosition({ targetWeight: 101 })).rejects.toThrow('validation failed');
  });

  test('the symbol provided should belong to a known company', async () => {});
});
