const { v4: uuidv4 } = require('uuid');

class Portfolio {
  constructor(name, ownerId) {
    this.uuid = uuidv4();
    this.name = name;
    this.ownerId = ownerId;
    this.created = Date.now();
  }
}

module.exports = Portfolio;
