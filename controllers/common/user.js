'use strict';

require('../../models/common/user');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
  create: function() {

  },
  readAll: function(req, res) {
    User.find({}, function(err, users) {
      res.send(users);
    });
  }
};
