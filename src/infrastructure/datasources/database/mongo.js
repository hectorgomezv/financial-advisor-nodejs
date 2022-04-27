const { MongoClient } = require('mongodb');
const logger = require('../../logger');

const {
  MONGO_DATABASE_NAME,
  MONGO_CONNECTION_STRING,
} = process.env;

let db;
const client = new MongoClient(MONGO_CONNECTION_STRING);

const getDb = async () => {
  try {
    if (!db) {
      await client.connect();
      db = await client.db(MONGO_DATABASE_NAME);
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
