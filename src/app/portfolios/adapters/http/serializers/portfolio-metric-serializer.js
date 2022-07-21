const init = app => {
  app.addSchema({
    $id: 'portfolioMetricSchema',
    type: 'object',
    properties: {
      timestamp: { type: 'number' },
      average: { type: 'number' },
    },
  });
};

module.exports = {
  init,
};
