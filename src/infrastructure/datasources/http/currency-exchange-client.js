const { CronJob } = require('cron');
const money = require('money');
const oxr = require('open-exchange-rates');

const { EXCHANGE_RATES_PROVIDER_APP_ID } = process.env;

const EVERY_HOUR_EXP = '0 * * * *';

let fx;

const initFx = () => new Promise((resolve, reject) => {
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
  const daemon = new CronJob(EVERY_HOUR_EXP, () => { fx = initFx(); });
  daemon.start();
};

const getFx = async () => {
  if (!fx) {
    fx = await initFx();
    initDaemon();
  }

  return fx;
};

module.exports = {
  getFx,
};
