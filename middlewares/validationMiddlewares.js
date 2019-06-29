const path = require('path');
const Joi = require('joi');
const logger = require('../libraries/logger');
const ApplicationError = require('../errors/ApplicationError');
const globalConstants = require('../constants/globalConstants');

const scriptName = path.basename(__filename);

class ValidationMiddlewares {
  /**
   * Validates paramaters of a request
   *
   * @param {object} schema { urlParams: object, queryParams: object, body: object }
   * @returns {Function} Middleware function to validate via JOI.
   */
  validateRequestParams(schema) {
    return (req, res, next) => {
      logger.debug(scriptName, 'validateInputRequest');

      try {
        if (req.method !== 'get') {
          req.body = this._validator(req.body, schema.body);
        }
        req.query = this._validator(req.query, schema.queryParams);
        req.params = this._validator(req.params, schema.urlParams);
        return next();
      } catch (error) {
        return next(
          new ApplicationError({
            message: error.message,
            status: globalConstants.HTTP_STATUS_CODES.VALIDATION_ERROR
          })
        );
      }
    };
  }

  _validator(data, schema, options = {}) {
    const defaultOptions = {
      allowUnknown: true,
      convert: true
    };
    const result = Joi.validate(data, schema, {
      ...defaultOptions,
      ...options
    });
    if (result.error) {
      throw result.error;
    }
    return result.value;
  }
}

module.exports = new ValidationMiddlewares();
