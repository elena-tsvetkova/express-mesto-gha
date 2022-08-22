const {ERROR, CONFLICT, FORBIDDEN, NOT_FOUND, UNAUTHORIZED} = require("./codes");

class BadRequest extends Error {
  constructor(message='Некорректный запрос') {
    super(message);
    this.statusCode = ERROR;
  }
}

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class Unauthorized extends Error {
  constructor(message='Необходима авторизация') {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = {BadRequest, Conflict, Forbidden, NotFound, Unauthorized};
