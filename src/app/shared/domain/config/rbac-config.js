const { ROLES } = require('./roles-config');

module.exports = {
  roles: Object.values(ROLES).map(role => role.name),
  permissions: {
    company: ['create', 'read', 'update', 'delete'],
    portfolio: ['create', 'read', 'update', 'delete'],
  },
  grants: {
    [ROLES.SUPERADMIN.name]: [
      'admin',
    ],
    [ROLES.ADMIN.name]: [
      'user',
      'create_company',
      'update_company',
      'delete_company',
    ],
    [ROLES.USER.name]: [
      'read_company',
      'create_portfolio',
      'read_portfolio',
      'update_portfolio',
      'delete_portfolio',
    ],
  },
};
