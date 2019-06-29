class OtherControllers {
  ping(req, res, next) {
    res.locals.response = { message: 'pong' };
    next();
  }
}

module.exports = new OtherControllers();
