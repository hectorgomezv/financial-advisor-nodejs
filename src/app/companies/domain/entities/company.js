const { v4: uuidv4 } = require('uuid');

class Company {
  constructor(name, symbol) {
    this.uuid = uuidv4();
    this.name = name;
    this.symbol = symbol;
  }
}

module.exports = Company;
