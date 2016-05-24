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
  email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
  },
  sessionToken: {
    type: String,
    required: false,
  },
  recoveryToken: {
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
