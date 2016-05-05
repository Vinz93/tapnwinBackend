/**
 * @author Juan Sanchez
 * @description User model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const crypto = require('crypto');

const Schema = mongoose.Schema;

/**
 * Validators
 */

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'not a valid email'
  })
];

/**
 * Schema
 */

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: {
      values: 'male female'.split(' '),
      message: '`{VALUE}` is not a valid gender'
    }
  },
  age: {
    type: Number,
    min: [0, '`{VALUE}` is not a valid age']
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator
  },
  password: {
    type: String,
    required: true
  },
  authToken: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate
   *
   * @param {String} plainText
   * @return {Boolean}
   * @description check if the passwords are the same
   */

  authenticate: function (plainText) {
    return crypto.createHash('md5').update(plainText).digest('hex') === this.password;
  }

};

/**
* Statics
*/

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @description get an user given a query criteria
   */

  load: function (options, cb) {
    options.select = options.select || 'firstName lastName email';
    return this.findOne(options.criteria)
    .select(options.select)
    .exec(cb);
  }

};

const User = mongoose.model('User', UserSchema);
