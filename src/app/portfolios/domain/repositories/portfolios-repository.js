let collection;

const init = async db => {
  collection = db.collection('portfolios');
};

const createPortfolio = portfolio => collection.insertOne(portfolio);
const deleteByUuid = uuid => collection.deleteOne({ uuid });
const findAll = () => collection.find({}).toArray();
const findByUuid = uuid => collection.findOne({ uuid });

module.exports = {
  createPortfolio,
  deleteByUuid,
  findAll,
  findByUuid,
  init,
};
