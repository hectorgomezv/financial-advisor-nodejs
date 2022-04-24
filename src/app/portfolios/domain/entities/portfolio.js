const { v4: uuidv4 } = require('uuid');

class Portfolio {
  constructor(name) {
    this.uuid = uuidv4();
    this.name = name;
  }
}

module.exports = Portfolio;
