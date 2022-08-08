const { CronJob } = require('cron');
const money = require('money');
const oxr = require('open-exchange-rates');

const { EXCHANGE_RATES_PROVIDER_APP_ID } = process.env;

const EVERY_HOUR_CRON_EXP = '0 * * * *';

let fx;

const refreshFx = () => new Promise((resolve, reject) => {
  if (!EXCHANGE_RATES_PROVIDER_APP_ID) {
    throw new Error('No EXCHANGE_RATES_PROVIDER_APP_ID provided');
  }

  oxr.set({ app_id: EXCHANGE_RATES_PROVIDER_APP_ID });

  oxr.latest(err => {
    if (err) {
      return reject(err);
    }

    money.rates = oxr.rates;
    money.base = oxr.base;

    return resolve(money);
  });
});

const initDaemon = () => {
  const daemon = new CronJob(EVERY_HOUR_CRON_EXP, async () => {
    fx = await refreshFx();
  });

  daemon.start();
};

const getFx = async () => {
  if (!fx) {
    fx = await refreshFx();
    initDaemon();
  }

  return fx;
};

module.exports = {
  getFx,
};
