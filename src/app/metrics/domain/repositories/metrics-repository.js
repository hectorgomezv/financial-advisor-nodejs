let metricsRegister;

const init = async register => {
  metricsRegister = register;
};

const getMetrics = () => metricsRegister.metrics();

module.exports = {
  getMetrics,
  init,
};
