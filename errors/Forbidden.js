const { FORBIDDEN } = require('../codes');

class Forbidden extends Error {
  constructor(message = 'Доступ запрещен') {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = Forbidden;
