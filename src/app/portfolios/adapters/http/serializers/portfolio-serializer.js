const init = app => {
  app.addSchema({
    $id: 'portfolioSchema',
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      name: { type: 'string' },
      positions: { type: 'array', items: { $ref: 'positionSchema' } },
      isValid: { type: 'boolean' },
    },
  });
};

module.exports = {
  init,
};
