const init = app => {
  app.addSchema({
    $id: 'portfolioSchema',
    type: 'object',
    properties: {
      uuid: { type: 'string' },
      name: { type: 'string' },
      created: { type: 'number' },
      positions: { type: 'array', items: { $ref: 'positionSchema' } },
      sumWeights: { type: 'number' },
      isValid: { type: 'boolean' },
    },
  });
};

module.exports = {
  init,
};
