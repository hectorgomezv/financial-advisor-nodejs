const { StatusCodes } = require('http-status-codes');

class InvalidJWTError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidJWTError';
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = InvalidJWTError;
