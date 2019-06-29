module.exports = {
  HTTP_STATUS_CODES: {
    CLIENT_ERROR: 400,
    VALIDATION_ERROR: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    SUCCESS: 200,
    REDIRECTION: 300
  },
  HTTP_METHODS: {
    GET: 'get',
    PUT: 'put',
    POST: 'post',
    PATCH: 'patch',
    DELETE: 'delete'
  },
  ERROR_MESSAGES: {
    GENERIC: 'Something went wrong.',
    NOT_FOUND: 'Not Found'
  },
  MIDDLEWARES: {
    PRE: 'pre',
    POST: 'post'
  }
};
