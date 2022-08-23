const { UNAUTHORIZED } = require('../codes');

class Unauthorized extends Error {
  constructor(message = 'Необходима авторизация') {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
