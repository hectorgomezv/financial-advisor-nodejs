/* eslint-disable no-underscore-dangle */
const { v4: uuidv4 } = require('uuid');

const COMPANIES_COLLECTION = 'companies';
const POSITIONS_COLLECTION = 'positions';

const POSITIONS = [{
  uuid: uuidv4(),
  targetWeight: 60,
  shares: 2,
}, {
  uuid: uuidv4(),
  targetWeight: 40,
  shares: 3,
}];

module.exports = {
  async up(db) {
    const companies = await db.collection(COMPANIES_COLLECTION).find().toArray();

    await db.collection(POSITIONS_COLLECTION)
      .insertOne({ ...POSITIONS[0], companyId: companies[0]._id });

    await db.collection(POSITIONS_COLLECTION)
      .insertOne({ ...POSITIONS[1], companyId: companies[1]._id });
  },

  async down(db) {
    await db.collection(POSITIONS_COLLECTION).deleteMany({});
  },
};
