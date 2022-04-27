const init = app => {
  app.addSchema({
    $id: 'positionSchema',
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      companyName: { type: 'string' },
      symbol: { type: 'string' },
      shares: { type: 'number' },
      value: { type: 'number' },
      targetWeight: { type: 'number' },
      currentWeight: { type: 'number' },
      deltaWeight: { type: 'number' },
    },
  });
};

module.exports = {
  init,
};
