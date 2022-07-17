let collection;

const init = async db => {
  collection = db.collection('positions');
};

const createPosition = position => collection.insertOne(position);
const deleteByUuid = uuid => collection.deleteOne({ uuid });
const deleteByPortfolioUuid = portfolioUuid => collection.deleteMany({ portfolioUuid });
const find = async () => collection.find({}).toArray();
const findByCompanyUuid = companyUuid => collection.find({ companyUuid }).toArray();

const findByCompanyUuidAndPortfolioUuid = (companyUuid, portfolioUuid) => collection
  .find({ companyUuid, portfolioUuid }).toArray();

const findByPortfolioUuid = portfolioUuid => collection.find({ portfolioUuid }).toArray();

const findByPortfolioUuidAndUuid = (portfolioUuid, uuid) => collection
  .findOne({ portfolioUuid, uuid });

const findByUuid = uuid => collection.findOne({ uuid });
const updatePosition = (uuid, patch) => collection.updateOne({ uuid }, { $set: patch });

module.exports = {
  createPosition,
  deleteByUuid,
  deleteByPortfolioUuid,
  find,
  findByCompanyUuid,
  findByCompanyUuidAndPortfolioUuid,
  findByPortfolioUuid,
  findByPortfolioUuidAndUuid,
  findByUuid,
  init,
  updatePosition,
};
