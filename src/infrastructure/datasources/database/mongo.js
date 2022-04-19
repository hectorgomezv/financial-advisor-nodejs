const { MongoClient } = require('mongodb');
const logger = require('../../logger');

const {
  FINANCIAL_ADVISOR_MONGO_DATABASE_NAME,
  FINANCIAL_ADVISOR_MONGO_CONNECTION_STRING,
} = process.env;

let db;
const client = new MongoClient(FINANCIAL_ADVISOR_MONGO_CONNECTION_STRING);

const getDb = async () => {
  try {
    if (!db) {
      await client.connect();
      db = client.db(FINANCIAL_ADVISOR_MONGO_DATABASE_NAME);
    }
  } catch (err) {
    logger.error(err);
  }

  return db;
};

const shutdown = async () => {
  await client.close();
};

module.exports = {
  getDb,
  shutdown,
};
