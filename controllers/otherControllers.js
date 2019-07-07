class OtherControllers {
  ping(req, res, next) {
    res.locals.response = { data: 'pong' };
    next();
  }
}

module.exports = new OtherControllers();
