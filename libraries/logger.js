const winston = require('winston');
const moment = require('moment');
const envConfig = require('../config/environment');

class Logger {
  constructor() {
    this.logger = this._initializeLoggerInstance();
  }

  /**
   * Log error messages
   * @returns {void}
   */
  error(...args) {
    this._logMsg('error', ...args);
  }

  /**
   * Log warning messages
   * @returns {void}
   */
  warn(...args) {
    this._logMsg('warn', ...args);
  }

  /**
   * Log informational messages
   * @returns {void}
   */
  info(...args) {
    this._logMsg('info', ...args);
  }

  /**
   * Log debugging messages
   * @returns {void}
   */
  debug(...args) {
    this._logMsg('debug', ...args);
  }

  _logMsg(level, context, message, meta) {
    this.logger[level](
      `[${context}] ${message}${meta ? `, ${JSON.stringify(meta)}` : ''}`
    );
  }

  _initializeLoggerInstance() {
    return winston.createLogger({
      level: envConfig.logger.level || 'debug',
      format: winston.format.json(),
      exitOnError: false,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(
              info =>
                `${moment(info.timestamp).format('DD-MMM-YYYY hh:mm:ss')} [${
                  info.level
                }]: ${info.message}`
            )
          )
        })
      ]
    });
  }
}

module.exports = new Logger();
