const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');
const { RBAC } = require('rbac');

const { RbacConfig } = require('../config');
const { AccessError } = require('../errors');

let rbac;

const ajv = new Ajv();
const validate = ajv.compile({
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' },
    exp: { type: 'number' },
    accessToken: { type: 'string' },
  },
  required: ['id', 'email', 'role', 'exp', 'accessToken'],
});

/**
 * Returns rbac object initialized.
 * On first call, rbac object is retrieved from configuration.
 * On subsequent calls, rbac is picked up from memory.
 * @returns RBAC object initialized, holding configured roles and permissions.
 */
const init = async () => {
  if (!rbac) {
    rbac = new RBAC(RbacConfig);
    await rbac.init();
  }

  return rbac;
};

/**
 * Checks if the provided user role has permission to perform the passed
 * action over the passed resource name.
 * @param {Context} execution context.
 * @param {String} action action to check.
 * @param {String} resource resource name to check.
 * @returns {Boolean} true indicating the user is authorized.
 * @throws UnauthorizedError if rbac is not initialized or the user
 * is unauthorized.
 */
async function isUserAllowedTo(context, action, resource) {
  const { auth } = context;

  if (!rbac) {
    throw new AccessError('Authorization system is not initialized');
  }

  if (!validate(auth)) {
    throw new ValidationError(validate.errors);
  }

  const can = await rbac.can(auth.role, action, resource);

  if (!can) {
    throw new AccessError('Insufficient permissions');
  }

  return true;
}

module.exports = {
  init,
  isUserAllowedTo,
};
