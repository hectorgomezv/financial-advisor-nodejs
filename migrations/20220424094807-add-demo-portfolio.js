const { Portfolio } = require('../src/app/portfolios/domain/entities');

const PORTFOLIOS_COLLECTION = 'portfolios';
const POSITIONS_COLLECTION = 'positions';

module.exports = {
  async up(db) {
    const portfolio = new Portfolio('My first portfolio');
    await db.collection(PORTFOLIOS_COLLECTION).insertOne(portfolio);

    await db.collection(POSITIONS_COLLECTION).updateMany(
      {},
      { $set: { portfolioUuid: portfolio.uuid } },
    );
  },

  async down(db) {
    const portfolio = await db.collection(PORTFOLIOS_COLLECTION).findOne({ name: 'My first portfolio' });
    await db.collection(PORTFOLIOS_COLLECTION).deleteOne({ uuid: portfolio.uuid });
    await db.collection(POSITIONS_COLLECTION).deleteMany({ portfolioUuid: portfolio.uuid });
  },
};
