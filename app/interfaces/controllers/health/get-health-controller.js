const { getHealth } = require('../../../domain/use-cases/health');

const getHealthController = async (req, res) => {
  const health = await getHealth();
  res.send(health);
};

module.exports = getHealthController;
