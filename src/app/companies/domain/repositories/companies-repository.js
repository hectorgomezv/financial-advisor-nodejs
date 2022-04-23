const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('companies');
};

init();

const find = () => collection.find({}).toArray();
const findByIdIn = ids => collection.find({ _id: { $in: ids } }).toArray();
const findBySymbol = symbol => collection.findOne({ symbol });
const createCompany = company => collection.insertOne(company);

module.exports = {
  createCompany,
  find,
  findByIdIn,
  findBySymbol,
};
