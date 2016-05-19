'use strict';

require('../../models/common/user');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
  create(req, res) {
    User.findOne({
      email: req.body.email,
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      if (!user.authenticate(req.body.password))
        return res.status(400).end();

      user.authToken = user.generateToken();

      user.save()
      .then(() => res.status(201).json({
        authToken: user.authToken,
      }))
      .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
  },
  delete(req, res) {
    const user = res.locals.user;

    user.authToken = undefined;

    user.save()
    .then(() => res.status(204).end())
    .catch(err => res.status(500).send(err));
  },
  validate(req, res, next) {
    User.findOne({
      authToken: req.get('authToken'),
    })
    .then(user => {
      if (!user)
        return res.status(401).end();

      res.locals.user = user;

      next();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};
