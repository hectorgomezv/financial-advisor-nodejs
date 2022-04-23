const { v4: uuidv4 } = require('uuid');

class CompanyState {
  constructor(companyUuid, price, peg) {
    this.uuid = uuidv4();
    this.timestamp = Date.now();
    this.companyUuid = companyUuid;
    this.price = price;
    this.peg = peg;
  }
}

module.exports = CompanyState;
