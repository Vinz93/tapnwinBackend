/**
 * @author Juan Sanchez
 * @description Admin model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'not a valid email',
  }),
];

const AdminSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
  },
  authToken: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

AdminSchema.methods = {

  /**
   * Authenticate
   *
   * @param {String} plainText
   * @return {Boolean}
   * @description check if the passwords are the same
   */

  authenticate: function (plainText) {
    return crypto.createHash('md5').update(plainText)
      .digest('hex') === this.password;
  },

};

AdminSchema.statics = {

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
  },

};

mongoose.model('Admin', AdminSchema);
