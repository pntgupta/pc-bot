const ApplicationError = require('../errors/ApplicationError');
const globalConstants = require('../constants/globalConstants');

class HTTPUtils {
  generateResponseJson(args) {
    const { success = null, error = null } = args;

    return {
      success,
      error: this.getErrorMessaage(error)
    };
  }

  getErrorMessaage(error) {
    if (error instanceof ApplicationError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message || globalConstants.ERROR_MESSAGES.GENERIC;
    }
    return error;
  }
}

module.exports = new HTTPUtils();
