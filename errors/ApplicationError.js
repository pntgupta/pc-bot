const globalConstants = require('../constants/globalConstants');

class ApplicationError extends Error {
  constructor({
    message = globalConstants.ERROR_MESSAGES.GENERIC,
    status = globalConstants.HTTP_STATUS_CODES.SERVER_ERROR,
    stack,
    name
  } = {}) {
    super(message);

    this.name = name || this.constructor.name;
    this.status = status;

    if (stack) {
      this.stack = stack;
    } else {
      // Capturing stack trace, excluding constructor call from it.
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApplicationError;
