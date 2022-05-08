let collection;

const init = async db => {
  collection = db.collection('positions');
};

const createPosition = position => collection.insertOne(position);
const deleteById = id => collection.deleteOne({ _id: id });
const find = async () => collection.find({}).toArray();
const findByCompanyUuid = companyUuid => collection.find({ companyUuid }).toArray();

const findByCompanyUuidAndPortfolioUuid = (companyUuid, portfolioUuid) => collection
  .find({ companyUuid, portfolioUuid }).toArray();

const findByPortfolioUuid = portfolioUuid => collection.find({ portfolioUuid }).toArray();
const findByUuid = uuid => collection.findOne({ uuid });
const updatePosition = (uuid, patch) => collection.updateOne({ uuid }, { $set: patch });

module.exports = {
  createPosition,
  deleteById,
  find,
  findByCompanyUuid,
  findByCompanyUuidAndPortfolioUuid,
  findByPortfolioUuid,
  findByUuid,
  init,
  updatePosition,
};
