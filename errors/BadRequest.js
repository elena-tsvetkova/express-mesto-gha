const ERROR = require('../codes');

class BadRequest extends Error {
  constructor(message = 'Некорректный запрос') {
    super(message);
    this.statusCode = ERROR;
  }
}

module.exports = BadRequest;
