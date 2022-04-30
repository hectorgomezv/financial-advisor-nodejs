let collection;

const init = async db => {
  collection = db.collection('companyStates');
};

const createCompanyState = data => collection.insertOne(data);

const getLastByCompanyUuid = async companyUuid => collection.findOne(
  { companyUuid },
  { sort: { timestamp: -1 }, limit: 1 },
);

// TODO: implement this using aggregation pipeline and use it in companies-service
// const getLastStatesByCompanyUuids = async companyUuids => ...

module.exports = {
  createCompanyState,
  getLastByCompanyUuid,
  init,
};
