const init = app => {
  app.addSchema({
    $id: 'portfolioSchema',
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      name: { type: 'string' },
    },
  });
};

module.exports = {
  init,
};
