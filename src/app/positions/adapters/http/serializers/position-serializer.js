const init = (app) => {
  app.addSchema({
    $id: 'positionSchema',
    type: 'object',
    properties: {
      companyName: { type: 'string' },
      targetWeight: { type: 'number' },
      shares: { type: 'number' },
    },
  });
};

module.exports = {
  init,
};
