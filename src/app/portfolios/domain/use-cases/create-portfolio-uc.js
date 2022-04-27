const Ajv = require('ajv');
const { default: ValidationError } = require('ajv/dist/runtime/validation_error');

const { PortfoliosRepository } = require('../repositories');
const { Portfolio } = require('../entities');
const { RbacService } = require('../../../shared/domain/services');

const ajv = new Ajv();
const validate = ajv.compile({
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
});

module.exports = async (context, input) => {
  await RbacService.isUserAllowedTo(context, 'create', 'portfolio');

  if (!validate(input)) {
    throw new ValidationError(validate.errors);
  }

  const portfolio = new Portfolio(input.name, context.auth.id);
  await PortfoliosRepository.createPortfolio(portfolio);

  return portfolio;
};
