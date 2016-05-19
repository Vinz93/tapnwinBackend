/**
 * @author Juan Sanchez
 * @description Game controller definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

require('../../models/common/game');

const Game = mongoose.model('Game');


module.exports = {

  readAll(req, res) {
    const criteria = req.query.criteria || {};
    const offset = !isNaN(req.query.offset) ? parseInt(req.query.offset, 10) : 0;
    const limit = !isNaN(req.query.limit) ? parseInt(req.query.limit, 10) : 20;

    Game.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(games => res.json(games))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    Game.create(req.body)
    .then(game => res.status(201).json(game))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Game.findById(req.params.game_id)
    .then(game => {
      if (!game)
        return res.status(404).end();
      res.json(game);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Game.findByIdAndUpdate(req.params.game_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(game => {
      if (!game)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Game.findByIdAndRemove(req.params.game_id)
    .then(game => {
      if (!game)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },
};
