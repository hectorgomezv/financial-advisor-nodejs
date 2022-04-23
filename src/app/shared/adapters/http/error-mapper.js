const { StatusCodes } = require('http-status-codes');

const mapError = err => ({
  status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
  error: err.name || 'GenericError',
  message: err.message || 'No message provided',
});

module.exports = { mapError };
