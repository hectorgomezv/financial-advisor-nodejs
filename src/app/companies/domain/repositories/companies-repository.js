const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('companies');
};

const createCompany = company => collection.insertOne(company);
const deleteById = id => collection.deleteOne({ _id: id });
const find = () => collection.find({}).toArray();
const findByUuidIn = uuids => collection.find({ uuid: { $in: uuids } }).toArray();
const findBySymbol = symbol => collection.findOne({ symbol });
const findByUuid = uuid => collection.findOne({ uuid });

module.exports = {
  createCompany,
  deleteById,
  find,
  findByUuidIn,
  findBySymbol,
  findByUuid,
  init,
};
