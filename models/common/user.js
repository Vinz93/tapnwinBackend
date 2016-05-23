/**
 * @author Juan Sanchez
 * @description User model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const paginate = require('mongoose-paginate');
const crypto = require('crypto');
const randtoken = require('rand-token');

const Schema = mongoose.Schema;

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'not a valid email',
  }),
];

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: {
      values: 'male female'.split(' '),
      message: '`{VALUE}` is not a valid gender',
    },
  },
  age: {
    type: Number,
    min: [0, '`{VALUE}` is not a valid age'],
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
    required: false,
  },
  pwdToken: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

UserSchema.methods = {
  authenticate(password) {
    return crypto.createHash('md5').update(password).digest('hex') === this.password;
  },
  generateToken() {
    return `${this._id}${randtoken.generate(16)}`;
  },
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password'))
    return next();

  user.password = crypto.createHash('md5').update(user.password).digest('hex');

  next();
});

UserSchema.plugin(paginate);

mongoose.model('User', UserSchema);
