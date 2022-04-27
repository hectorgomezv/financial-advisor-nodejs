const { get, isString } = require('lodash');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

/**
 * Extracts the JWT sent in the request headers without verifying its expiration.
 * @returns {Object} Auth object containing user id, email and roles array.
 * @param {Object} headers request headers.
 * @returns {String} token extracted from headers.
 */
function extractAccessToken(headers) {
  const authorization = get(headers, 'authorization');
  if (!authorization || !isString(authorization) || !authorization.startsWith('Bearer ')) {
    throw new Error('Authorization required');
  }

  return authorization.slice(7, authorization.length);
}

/**
 * Extracts and verifies the JWT sent in the request headers.
 * @returns {Object} Auth object containing user id, email and roles array.
 * @param {Object} headers request headers.
 * @returns {Auth} auth object.
 */
function parseAuth(headers) {
  try {
    const token = extractAccessToken(headers);
    const {
      id,
      email,
      roles,
      permissions,
      exp,
    } = jwt.verify(token, JWT_SECRET);

    return {
      id,
      email,
      roles,
      permissions,
      exp,
      accessToken: token,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Adds auth object with user credentials to the request object.
 * @param {Object} req request object.
 * @param {Object} res response object.
 * @param {Function} next next function in the middleware pipeline.
 */
function addAuthHeader(req, res, next) {
  try {
    const { headers } = req;

    req.context.auth = parseAuth(headers);
  } catch (err) {
    return next(err);
  }

  return next();
}

module.exports = {
  addAuthHeader,
};
