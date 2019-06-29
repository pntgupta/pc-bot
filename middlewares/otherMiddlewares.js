const path = require('path');
const logger = require('../libraries/logger');

const scriptName = path.basename(__filename);

class OtherMiddlewares {
  logInputRequest(req, res, next) {
    logger.info(scriptName, 'logInputRequest', {
      url: req.url,
      body: req.body
    });
    return next();
  }
}

module.exports = new OtherMiddlewares();
