const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const https = require('https');

const logger = require('./libraries/logger');
const routes = require('./routes');
const httpUtils = require('./utils/httpUtils');
const envConfig = require('./config/environment');
const globalConstants = require('./constants/globalConstants');
const ApplicationError = require('./errors/ApplicationError');

const scriptName = path.basename(__filename);

logger.info(scriptName, envConfig.logger.level);

class Server {
  constructor() {
    this.app = express();
    this.ip = envConfig.server.ip;
    this.port = process.env.PORT || envConfig.server.port;

    this._attachPreMiddlewares();
    this._attachRouteHandlers();
    this._attachErrorHandlers();
    this._startServer();
  }

  _attachPreMiddlewares() {
    // Body Parser
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    // Cookie Parser
    this.app.use(cookieParser());
  }

  _attachRouteHandlers() {
    this.app.use('/', routes);

    // Catch any unknown routes throw 404
    this.app.use((req, res, next) => {
      try {
        logger.info(scriptName, 'Invalid route', { url: req.url });

        const error = new ApplicationError({
          message: globalConstants.ERROR_MESSAGES.NOT_FOUND
        });
        return res
          .status(globalConstants.HTTP_STATUS_CODES.NOT_FOUND)
          .send(httpUtils.generateResponseJson({ error }));
      } catch (error) {
        return next(error);
      }
    });
  }

  _attachErrorHandlers() {
    this.app.use((error, req, res, next) => {
      logger.info(scriptName, 'Error handler');

      try {
        const statusCode =
          error.status || globalConstants.HTTP_STATUS_CODES.SERVER_ERROR;
        const errorMessage = error.message || error;

        if (statusCode === globalConstants.HTTP_STATUS_CODES.SERVER_ERROR) {
          logger.error(scriptName, errorMessage, error);
        } else {
          logger.info(scriptName, errorMessage, error);
        }

        const response = httpUtils.generateResponseJson({ error });
        res.status(statusCode).send(response);
      } catch (err) {
        next(err);
      }
    });

    // Default Error Handler
    this.app.use((error, req, res, _next) =>
      res.status(500).send({ error: 'System Failure.' })
    );
  }

  _startServer() {
    const args = this.ip
      ? [this.port, this.ip, () => this._onServerStart()]
      : [this.port, () => this._onServerStart()];
    if (envConfig.features.https === true) {
      const key = fs.readFileSync(envConfig.server.https.key);
      const cert = fs.readFileSync(envConfig.server.https.cert);
      const options = {
        key,
        cert
      };
      this.app.server = https.createServer(options, this.app).listen(...args);
    } else {
      this.app.server = this.app.listen(...args);
    }
  }

  _onServerStart() {
    logger.info(
      scriptName,
      `Process ${process.pid} listening on: ${this.ip}:${this.port}`,
      { env: envConfig.env }
    );
  }
}

module.exports = new Server();
