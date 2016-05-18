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

  readAll: function(req, res) {

    Game.paginate({
      limit: req.query.limit,
      offset: req.query.offset,
      criteria: req.query.criteria
    }, function (err, json) {

      if (err)
        return res.status(500).send(err);

      res.json(json).end();
    });
  },

  create: function(req, res) {

    Game.create(req.body, function (err, json) {

      if (err) {
        if (err.name === 'ValidationError')
          return res.status(400).json(err).end();
        else
          return res.status(500).send(err);
      }

      res.json(json).status(201).end();
    });
  },

  read: function(req, res) {

    Game.findById(req.params.game_id)
    .exec(function (err, game) {

      if (err) {
        if(err.name === 'CastError') {
          return res.status(400).send(err);
        }else{
          return res.status(500).send(err);
        }
      }

      if (!game)
        return res.status(404).end();

      res.json(game);
    });
  },

  update: function(req, res) {

    Game.findByIdAndUpdate(req.params.game_id, req.body,
      { runValidators: true, context: 'query' },
      function (err, company) {

      if (err) {
        if(err.name === 'CastError') {
          return res.status(400).send(err);
        }else{
          return res.status(500).send(err);
        }
      }

      if (!company)
        return res.status(404).end();

      res.status(204).end();
    });
  },

  delete: function(req, res) {

    Game.findByIdAndRemove(req.params.game_id, function (err, game) {

      if (err) {
        if(err.name === 'CastError') {
          return res.status(400).send(err);
        }else{
          return res.status(500).send(err);
        }
      }

      if (!game)
        return res.status(404).end();

      res.status(204).end();
    });
  }
};
