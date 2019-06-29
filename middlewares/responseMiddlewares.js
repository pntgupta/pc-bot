const path = require('path');
const logger = require('../libraries/logger');
const httpUtils = require('../utils/httpUtils');
const globalConstants = require('../constants/globalConstants');

const scriptName = path.basename(__filename);

class ResponseMiddlewares {
  defaultResponseBuilder(req, res) {
    logger.debug(scriptName, 'defaultResponseBuilder', {
      response: res.locals.response
    });

    const {
      status = globalConstants.HTTP_STATUS_CODES.SUCCESS,
      data = 'OK'
    } = res.locals.response;
    res.status(status).send(httpUtils.generateResponseJson({ success: data }));
  }
}

module.exports = new ResponseMiddlewares();
