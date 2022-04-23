const { v4: uuidv4 } = require('uuid');

class Position {
  constructor(targetWeight, shares, companyUuid, symbol) {
    this.uuid = uuidv4();
    this.targetWeight = targetWeight;
    this.shares = shares;
    this.companyUuid = companyUuid;
    this.symbol = symbol;
  }
}

module.exports = Position;
