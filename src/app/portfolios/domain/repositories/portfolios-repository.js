const { database } = require('../../../../infrastructure/datasources/database');

let collection;

const init = async () => {
  const db = await database.getDb();
  collection = db.collection('portfolios');
};

init();

const createPortfolio = portfolio => collection.insertOne(portfolio);
const deleteByUuid = uuid => collection.deleteOne({ uuid });
const findAll = () => collection.find({}).toArray();
const findByUuid = uuid => collection.findOne({ uuid });

module.exports = {
  createPortfolio,
  deleteByUuid,
  findAll,
  findByUuid,
};
