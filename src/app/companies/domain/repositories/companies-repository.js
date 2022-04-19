const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('companies');
};

init();

const find = async () => {
  const companies = await collection.find({}).toArray();

  return companies;
};

module.exports = {
  find,
};
