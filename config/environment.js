const APP_NAME = process.env.APP_NAME || 'APP';

class EnvironmentConfig {
  constructor() {
    this.config = {
      appName: APP_NAME,
      env: this._fetchFromEnv('ENV'),
      server: {
        ip: this._fetchFromEnv('BIND_IP'),
        port: this._fetchFromEnv('PORT'),
        https: {
          key: this._fetchFromEnv('HTTPS_KEY'),
          cert: this._fetchFromEnv('HTTPS_CERT')
        }
      },
      features: {
        https: this._fetchFeaturesFromEnv('IS_HTTPS')
      },
      logger: {
        level: this._fetchFromEnv('LOGGER_LEVEL')
      },
      slack: {
        id: this._fetchFromEnv('SLACK_BOT_ID'),
        userId: this._fetchFromEnv('SLACK_BOT_USER_ID'),
        appToken: this._fetchFromEnv('SLACK_APP_TOKEN'),
        appId: this._fetchFromEnv('SLACK_APP_ID'),
        authToken: this._fetchFromEnv('SLACK_BOT_AUTH_TOKEN')
      }
    };
  }

  _fetchFromEnv(property) {
    return process.env[`${APP_NAME}_${property}`];
  }

  _fetchFeaturesFromEnv(property) {
    return process.env[`${APP_NAME}_FEATURES_${property}`];
  }
}

module.exports = new EnvironmentConfig().config;
