const init = (app) => {
  app.addSchema({
    $id: 'companySchema',
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      symbol: { type: 'string' },
      name: { type: 'string' },
    },
  });
};

module.exports = {
  init,
};
