const { CONFLICT } = require('../codes');

class Conflict extends Error {
  constructor(message = 'Конфликт') {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = Conflict;
