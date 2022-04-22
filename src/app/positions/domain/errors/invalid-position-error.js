const { StatusCodes } = require('http-status-codes');

class InvalidPositionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidPositionError';
    this.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InvalidPositionError;
