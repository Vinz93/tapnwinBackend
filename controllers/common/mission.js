/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

require('../../models/common/mission');

const Mission = mongoose.model('Mission');


module.exports = {

  readAll: function(req, res) {

    Mission.paginate({
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

    Mission.create(req.body, function (err, json) {

      if (err) {
        if (err.name === 'ValidationError')
          return res.status(400).json(err).end();

        return res.status(500).send(err);
      }

      res.json(json).status(201).end();
    });
  },

  read: function(req, res) {

    Mission.findById(req.params.mission_id)
    .populate('gameIds')
    .exec(function (err, mission) {

      if (err) {
        if(err.name === 'CastError') {
          return res.status(400).send(err);
        }else{
          return res.status(500).send(err);
        }
      }

      if (!mission)
        return res.status(404).end();

      res.json(mission);
    });
  },

  update: function(req, res) {

    Mission.findByIdAndUpdate(req.params.mission_id, req.body,
      { runValidators: true, context: 'query' },
      function (err, mission) {

      if (err) {
        if(err.name === 'CastError') {
          return res.status(400).send(err);
        }else{
          return res.status(500).send(err);
        }
      }

      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    });
  },

  delete: function(req, res) {

    Mission.findByIdAndRemove(req.params.mission_id, function (err, mission) {

      if (err) {
        if(err.name === 'CastError') {
          return res.status(400).send(err);
        }else{
          return res.status(500).send(err);
        }
      }

      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    });
  }
};
