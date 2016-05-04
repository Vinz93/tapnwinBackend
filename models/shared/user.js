'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
  email: {},
  password: {},
  authToken: {},

}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
