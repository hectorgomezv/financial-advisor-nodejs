let collection;

const init = async db => {
  collection = db.collection('portfolios');
};

const createPortfolio = portfolio => collection.insertOne(portfolio);
const deleteByUuid = uuid => collection.deleteOne({ uuid });
const findAll = () => collection.find({}).toArray();
const findByOwnerId = ownerId => collection.find({ ownerId }).toArray();
const findByUuid = uuid => collection.findOne({ uuid });
const findByUuidAndOwnerId = (uuid, ownerId) => collection.findOne({ uuid, ownerId });

module.exports = {
  createPortfolio,
  deleteByUuid,
  findAll,
  findByOwnerId,
  findByUuid,
  findByUuidAndOwnerId,
  init,
};
