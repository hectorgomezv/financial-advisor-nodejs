const { StatusCodes } = require('http-status-codes');

class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyExistError';
    this.status = StatusCodes.CONFLICT;
  }
}

module.exports = AlreadyExistError;
