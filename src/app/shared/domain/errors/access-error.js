const { StatusCodes } = require('http-status-codes');

class AccessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessError';
    this.status = StatusCodes.FORBIDDEN;
  }
}

module.exports = AccessError;
