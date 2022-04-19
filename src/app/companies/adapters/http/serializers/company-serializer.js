const init = (app) => {
  app.addSchema({
    $id: 'companySchema',
    type: 'object',
    properties: {
      symbol: { type: 'string' },
      name: { type: 'string' },
    },
  });
};

module.exports = {
  init,
};
