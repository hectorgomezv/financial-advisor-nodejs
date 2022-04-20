const init = app => {
  app.addSchema({
    $id: 'positionSchema',
    type: 'object',
    properties: {
      companyName: { type: 'string' },
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
