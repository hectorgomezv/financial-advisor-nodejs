let collection;

const init = async db => {
  collection = db.collection('positions');
};

const createPosition = position => collection.insertOne(position);
const deleteById = id => collection.deleteOne({ _id: id });
const find = async () => collection.find({}).toArray();

const findByCompanyUuidAndPortfolioUuid = (companyUuid, portfolioUuid) => collection
  .find({ companyUuid, portfolioUuid }).toArray();

const findByPortfolioUuid = portfolioUuid => collection.find({ portfolioUuid }).toArray();
const findByUuid = uuid => collection.findOne({ uuid });

module.exports = {
  createPosition,
  deleteById,
  find,
  findByCompanyUuidAndPortfolioUuid,
  findByPortfolioUuid,
  findByUuid,
  init,
};
