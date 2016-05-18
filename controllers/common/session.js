'use strict';

require('../../models/common/user');

const mongoose = require('mongoose');
const randToken = require('rand-token');
const User = mongoose.model('User');

module.exports = {
  create(req, res) {
    User.findOne({
      email: req.body.email,
    }, (err, user) => {
      if (err)
        return res.status(500).send(err);

      if (!user)
        return res.status(404).end();

      if (!user.authenticate(req.body.password))
        return res.status(400).end();

      user.authToken = randToken.generate(16);

      user.save(err => {
        if (err)
          return res.status(500).send(err);

        res.json({
          authToken: user.authToken,
        }).status(201).end();
      });
    });
  },
  delete(req, res) {
    User.findByIdAndRemove(req.params.user_id, (err, user) => {
      if (err)
        return res.status(500).send(err);

      if (!user)
        return res.status(404).end();

      res.status(204).end();
    });
  },
  validate(req, res, next) {
    /*
    User.findOne({
      authToken: req.get('authToken'),
    }, (err, user) => {

    });
    req.app.locals.models.Session
    .forge({
      token: req.get('token'),
    })
    .fetch()
    .then(function (session) {
      if (session) {
        res.locals.user = {
          identity_card: session.get('user_identity_card'),
        };
        next();
      }
      else
        res.status(401).json({
          error: 'User or login not found',
        });
    })
    .otherwise(function () {
      res.status(400).send();
    });
    */
  },
};
