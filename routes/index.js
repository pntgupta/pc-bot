const express = require('express');

const routes = require('./routes');
const globalConstants = require('../constants/globalConstants');

class Router {
  constructor() {
    this.router = express.Router();

    this._initializeRoutes();
  }

  _initializeRoutes() {
    Object.values(globalConstants.HTTP_METHODS).forEach(method => {
      const routesConfig = routes[method.toUpperCase()];
      if (routesConfig && Object.keys(routesConfig).length) {
        Object.keys(routesConfig).forEach(route => {
          const { middlewares = [], handle = [] } = routesConfig[route] || {};
          this.router[method](route, [
            ...middlewares[globalConstants.MIDDLEWARES.PRE],
            ...handle,
            ...middlewares[globalConstants.MIDDLEWARES.POST]
          ]);
        });
      }
    });
  }
}

module.exports = new Router().router;
