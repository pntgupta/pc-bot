// const joiSchemas = require('../schemas/joi');
const otherControllers = require('../controllers/otherControllers');
const slackWebHookControllers = require('../controllers/slackWebHookControllers');
const validationMiddlewares = require('../middlewares/validationMiddlewares');
const otherMiddlewares = require('../middlewares/otherMiddlewares');
const responseMiddlewares = require('../middlewares/responseMiddlewares');

module.exports = {
  POST: {
    '/slack/event': {
      handle: [slackWebHookControllers.processEvent],
      middlewares: {
        pre: [
          otherMiddlewares.logInputRequest,
          validationMiddlewares.validateToken,
          validationMiddlewares.validateAppId,
          validationMiddlewares.validateMessage
          // validationMiddlewares.validateRequestParams(joiSchemas.getOptimalTime)
        ],
        post: [responseMiddlewares.plainResponseSender]
      }
    }
  },
  GET: {
    '/ping': {
      handle: [otherControllers.ping],
      middlewares: {
        pre: [
          otherMiddlewares.logInputRequest
          // validationMiddlewares.validateRequestParams(joiSchemas.getOptimalTime)
        ],
        post: [responseMiddlewares.defaultResponseBuilder]
      }
    }
  },
  PATCH: {},
  DELETE: {}
};
