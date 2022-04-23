const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('positions');
};

init();

const createPosition = position => collection.insertOne(position);
const deleteById = id => collection.deleteOne({ _id: id });
const find = async () => collection.find({}).toArray();
const findByCompanyId = companyId => collection.find({ companyId }).toArray();
const findByUuid = uuid => collection.findOne({ uuid });

module.exports = {
  createPosition,
  deleteById,
  find,
  findByCompanyId,
  findByUuid,
};
