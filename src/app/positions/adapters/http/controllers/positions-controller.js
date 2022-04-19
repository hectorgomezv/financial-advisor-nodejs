const { getPositions } = require('../../../domain/use-cases');

const getPositionsCtl = async (req, res) => {
  const positions = await getPositions();
  res.send(positions);
};

module.exports = {
  getPositionsCtl,
};
