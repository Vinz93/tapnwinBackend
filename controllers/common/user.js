'use strict';

require('../../models/common/user');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
  create() {

  },
  readAll(req, res) {
    User.find({}, (err, users) => {
      res.send(users);
    });
  },
};
