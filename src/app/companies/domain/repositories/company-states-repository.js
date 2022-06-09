let collection;

const init = async db => {
  collection = db.collection('companyStates');
};

const createCompanyState = data => collection.insertOne(data);

const getLastByCompanyUuid = async companyUuid => collection.findOne(
  { companyUuid },
  { sort: { timestamp: -1 }, limit: 1 },
);

const getLastByCompanyUuids = async uuids => collection.aggregate([
  { $match: { companyUuid: { $in: uuids } } },
  { $group: { _id: '$companyUuid', state: { $last: '$$ROOT' } } },
  {
    $lookup: {
      from: 'companies',
      localField: '_id',
      foreignField: 'uuid',
      as: 'company',
    },
  },
]).toArray();

module.exports = {
  createCompanyState,
  getLastByCompanyUuid,
  getLastByCompanyUuids,
  init,
};
