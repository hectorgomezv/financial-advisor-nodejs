const init = app => {
  app.addSchema({
    $id: 'companySchema',
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
      state: {
        type: 'object',
        properties: {
          price: { type: 'number' },
          peg: { type: 'number' },
          timestamp: { type: 'number' },
        },
      },
    },
  });
};

module.exports = {
  init,
};
