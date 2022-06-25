let collection;
let cache;

const init = async (cacheInstance, db) => {
  collection = db.collection('companyStates');
  cache = cacheInstance;
};

const LAST_STATES_CACHE_KEY = 'lastStates';

const createCompanyState = async data => {
  await cache.del(LAST_STATES_CACHE_KEY);

  return collection.insertOne(data);
};

const getLastByCompanyUuid = async companyUuid => collection.findOne(
  { companyUuid },
  { sort: { timestamp: -1 }, limit: 1 },
);

const getLastByCompanyUuids = async uuids => {
  const copy = await cache.get(LAST_STATES_CACHE_KEY);

  if (copy) {
    return JSON.parse(copy);
  }

  const result = await collection.aggregate([
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

  await cache.set(LAST_STATES_CACHE_KEY, JSON.stringify(result));

  return result;
};

module.exports = {
  createCompanyState,
  getLastByCompanyUuid,
  getLastByCompanyUuids,
  init,
};
