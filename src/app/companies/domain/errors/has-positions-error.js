const { StatusCodes } = require('http-status-codes');

class HasPositionsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HasPositionsError';
    this.status = StatusCodes.NOT_ACCEPTABLE;
  }
}

module.exports = HasPositionsError;
