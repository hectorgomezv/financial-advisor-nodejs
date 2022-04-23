const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('companies');
};

init();

const createCompany = company => collection.insertOne(company);
const deleteById = id => collection.deleteOne({ _id: id });
const find = () => collection.find({}).toArray();
const findByIdIn = ids => collection.find({ _id: { $in: ids } }).toArray();
const findBySymbol = symbol => collection.findOne({ symbol });
const findByUuid = uuid => collection.findOne({ uuid });

module.exports = {
  createCompany,
  deleteById,
  find,
  findByIdIn,
  findBySymbol,
  findByUuid,
};
