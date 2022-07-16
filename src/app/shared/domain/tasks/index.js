const refreshCurrenciesExchangeRatesTask = require('./refresh-currencies-exchange-rates-task');

const start = () => {
  refreshCurrenciesExchangeRatesTask.run();
};

module.exports = {
  start,
};
