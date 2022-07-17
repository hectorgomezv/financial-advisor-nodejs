const { v4: uuidv4 } = require('uuid');

class PortfolioState {
  constructor(portfolioUuid, isValid, sumWeights, totalValueEUR) {
    this.uuid = uuidv4();
    this.timestamp = Date.now();
    this.portfolioUuid = portfolioUuid;
    this.isValid = isValid;
    this.sumWeights = sumWeights;
    this.totalValueEUR = totalValueEUR;
  }
}

module.exports = PortfolioState;
