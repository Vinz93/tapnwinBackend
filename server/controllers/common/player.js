'use strict';

require('../../models/common/player');

const mongoose = require('mongoose');

const Player = mongoose.model('Player');

module.exports = {
  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Player.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['userId'],
    })
    .then(player => res.json(player))
    .catch(err => res.status(500).send(err));
  },
  create(req, res) {
    Player.create(req.body)
    .then(player => res.status(201).json(player))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
};
