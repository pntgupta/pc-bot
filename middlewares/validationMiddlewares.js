const path = require('path');
const Joi = require('joi');
const logger = require('../libraries/logger');
const ApplicationError = require('../errors/ApplicationError');
const globalConstants = require('../constants/globalConstants');
const errorMessages = require('../constants/errorMessages');
const envConfig = require('../config/environment');

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

  validateToken(req, res, next) {
    logger.debug(scriptName, 'validateToken');

    if (req.body.token === envConfig.slack.appToken) {
      next();
    } else {
      next(
        new ApplicationError({
          message: errorMessages.SLACK.INVALID_APP_TOKEN,
          status: globalConstants.HTTP_STATUS_CODES.VALIDATION_ERROR
        })
      );
    }
  }

  /**
   * End the request if the event is not indended for this bot.
   * @param {*} req -
   * @param {*} res -
   * @param {*} next -
   * @returns {void}
   */
  validateAppId(req, res, next) {
    logger.debug(scriptName, 'validateAppId');

    if (
      req.body.api_app_id &&
      envConfig.slack.appId &&
      req.body.api_app_id !== envConfig.slack.appId
    ) {
      logger.info(
        scriptName,
        'validateAppId',
        'Message not meant for this bot, not processing.'
      );
      res.send();
    } else {
      next();
    }
  }

  /**
   * This is to prevent the reply for any message posted by this bot.
   * @param {*} req -
   * @param {*} res -
   * @param {*} next -
   * @returns {void}
   */
  validateMessage(req, res, next) {
    logger.debug(scriptName, 'validateMessage');

    if (
      req.body.event &&
      (req.body.event.bot_id === envConfig.slack.id ||
        req.body.event.user === envConfig.slack.userId)
    ) {
      logger.info(scriptName, 'validateMessage', 'Bot message, not processing');
      res.send();
    } else {
      next();
    }
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
