const path = require('path');
const request = require('request-promise');
const logger = require('../../libraries/logger');
const envConfig = require('../../config/environment');

const scriptName = path.basename(__filename);

class PostSlackHttpService {
  constructor() {
    this.postMessageAPI = 'https://slack.com/api/chat.postMessage';
  }

  postMsgToslack({ channel, text = '', attachments = [] }) {
    logger.info(scriptName, 'postMsgToslack');

    request({
      method: 'POST',
      uri: this.postMessageAPI,
      body: {
        ok: true,
        channel,
        text,
        as_user: true,
        attachments
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${envConfig.slack.authToken}`
      },
      json: true
    })
      .then(response => {
        if (!response.ok) {
          logger.error(scriptName, 'postMsgToslack-response', {
            error: response.error
          });
        } else {
          logger.info(scriptName, 'postMsgToslack-response', response);
        }
      })
      .catch(err => logger.error(scriptName, 'postMsgToslack-error', err));
  }
}

module.exports = new PostSlackHttpService();
