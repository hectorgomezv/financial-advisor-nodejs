const { getHealth } = require('../../../domain/use-cases');

const getHealthController = async (req, res) => {
  const health = await getHealth();
  res.send(health);
};

module.exports = { getHealthController };
