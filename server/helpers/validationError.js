'use strict';

module.exports = function ValidationError(message, value) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.value = value;
};

require('util').inherits(module.exports, Error);
