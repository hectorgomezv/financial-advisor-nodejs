const { v4: uuidv4 } = require('uuid');

const COLLECTION = 'companies';

const COMPANIES = [{
  uuid: uuidv4(),
  name: 'Apple Inc.',
  symbol: 'AAPL',
}, {
  uuid: uuidv4(),
  name: 'Alphabet Inc.',
  symbol: 'GOOGL',
}];

module.exports = {
  async up(db) {
    await db.collection(COLLECTION).insertMany(COMPANIES);
  },

  async down(db) {
    await db.collection(COLLECTION).deleteMany({ symbol: { $in: COMPANIES.map(c => c.symbol) } });
  },
};
