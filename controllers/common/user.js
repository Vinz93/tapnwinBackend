'use strict';

require('../../models/common/user');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
  read(req, res) {
    User.findById(req.params.user_id)
      .exec((err, user) => {
        if (err) {
          if (err.name === 'CastError' && err.kind === 'ObjectId')
            return res.status(404).end();

          return res.status(500).send(err);
        }

        if (!user)
          return res.status(404).end();

        res.json(user);
      });
  },
  readAll(req, res) {
    User.find({}, (err, users) => {
      res.send(users);
    });
  },
  create(req, res) {
    User.create(req.body, (err, user) => {
      if (err) {
        if (err.name === 'ValidationError')
          return res.status(400).json(err).end();

        return res.status(500).send(err);
      }

      res.json(user).status(201).end();
    });
  },
  update(req, res) {
    User.findByIdAndUpdate(req.params.user_id, req.body, {
      runValidators: true,
      context: 'query',
    },
    (err, user) => {
      if (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId')
          return res.status(404).end();

        return res.status(500).send(err);
      }
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    });
  },
  delete(req, res) {
    User.findByIdAndRemove(req.params.user_id, (err, user) => {
      if (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId')
          return res.status(404).end();

        return res.status(500).send(err);
      }

      if (!user)
        return res.status(404).end();

      res.status(204).end();
    });
  },
};
