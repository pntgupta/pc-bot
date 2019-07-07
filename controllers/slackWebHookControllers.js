const path = require('path');
const logger = require('../libraries/logger');
const SlackWebHookUseCase = require('../useCase/slackWebHookUseCase');

const scriptName = path.basename(__filename);

class SlackWebHookControllers {
  processEvent(req, res, next) {
    const { challenge, type, ...payload } = req.body;

    res.locals.response = {
      data: module.exports._processByEventType({ challenge, type, payload })
    };
    next();
  }

  _processByEventType({ challenge, type, payload }) {
    switch (type) {
      case 'url_verification':
        return SlackWebHookUseCase.verifyChallenge({ challenge });
      case 'event_callback':
        return SlackWebHookUseCase.processUserCommand(payload);
      default:
        logger.info(scriptName, '_processByEventType', { type });
        return null;
    }
  }
}

module.exports = new SlackWebHookControllers();
