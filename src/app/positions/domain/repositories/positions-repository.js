const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('positions');
};

init();

const find = async () => {
  const positions = await collection.find({}).toArray();

  return positions;
};

module.exports = {
  find,
};
