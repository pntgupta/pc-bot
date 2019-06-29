// const joiSchemas = require('../schemas/joi');
const otherControllers = require('../controllers/otherControllers');
// const validationMiddlewares = require('../middlewares/validationMiddlewares');
const otherMiddlewares = require('../middlewares/otherMiddlewares');
const responseMiddlewares = require('../middlewares/responseMiddlewares');

module.exports = {
  POST: {},
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
