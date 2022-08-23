const { NOT_FOUND } = require('../codes');

class NotFound extends Error {
  constructor(message = 'Не существует') {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFound;
