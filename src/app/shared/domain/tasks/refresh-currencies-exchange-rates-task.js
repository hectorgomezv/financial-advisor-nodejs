const oxr = require("open-exchange-rates");
const fx = require("money");

const { EXCHANGE_RATES_PROVIDER_APP_ID } = process.env;

oxr.set({ app_id: EXCHANGE_RATES_PROVIDER_APP_ID });

oxr.latest(() => {
  fx.rates = oxr.rates;
  fx.base = oxr.base;
});
