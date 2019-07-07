const path = require('path');
const logger = require('../libraries/logger');
const postSlackHttpService = require('../services/http/postSlackHttpService');
const commands = require('../commands');
const ApplicationError = require('../errors/ApplicationError');
const globalConstants = require('../constants/globalConstants');
const errorMessages = require('../constants/errorMessages');

const scriptName = path.basename(__filename);

class SlackWebHookUseCase {
  verifyChallenge({ challenge }) {
    if (challenge) {
      return { challenge };
    }

    throw new ApplicationError({
      message: errorMessages.SLACK.MISSING_CHALLENGE_KEY,
      status: globalConstants.HTTP_STATUS_CODES.VALIDATION_ERROR
    });
  }

  /**
   * 
   * @param {obect} payload - 
   *  {  
        "token":"...", // App Token
        "team_id":"T0UJLNTTM", // Team ID
        "api_app_id":"...", // Bot ID for which this msg is intended to
        "event":{  
          "client_msg_id":"6a8def46-5601-4ba6-ba36-5d5adc00a7a1",
          "type":"message", // name of the event
          "text":"hi",
          "user":"U9UT6RVDG",
          "ts":"1562484390.000200",
          "team":"T0UJLNTTM", // Team ID same as above
          "channel":"...", // Channel ID
          "event_ts":"1562484390.000200", // When the event was dispatched
          "channel_type":"im"
        },
        "type":"event_callback", // Event Type
        "event_id":"EvL8T1CFFG", // Unique ID
        "event_time":1562484390, // Time
        "authed_users":[ // event would be visible to those users 
          "UL13DBKLP" 
        ]
      }
   * 
   * @returns {void}
   */
  processUserCommand(payload) {
    logger.info(scriptName, 'processUserCommand');

    let [, commandName, args] = payload.event.text.match(/!(\w+)(.*)/);
    commandName = commandName.toLowerCase();
    args = args.trim().slice(' ');

    const [, command = commands.notFound] =
      Object.entries(commands).find(
        ([key]) =>
          commandName === key ||
          (commands[key].alias && commands[key].alias.includes(commandName))
      ) || [];

    const {
      channel = payload.event.channel,
      text,
      attachments
    } = command.execute(args);

    postSlackHttpService.postMsgToslack({
      channel,
      text,
      // https://api.slack.com/docs/message-attachments
      attachments
    });
  }
}

module.exports = new SlackWebHookUseCase();
