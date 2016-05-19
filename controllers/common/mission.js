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

  readAll(req, res) {
    const criteria = req.query.criteria || {};
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;

    Mission.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    }, (err, json) => {
      if (err)
        return res.status(500).send(err);

      res.json(json).end();
    });
  },

  create(req, res) {
    Mission.create(req.body, (err, json) => {
      if (err) {
        if (err.name === 'ValidationError')
          return res.status(400).json(err).end();

        return res.status(500).send(err);
      }

      res.json(json).status(201).end();
    });
  },

  read(req, res) {
    Mission.findById(req.params.mission_id)
    .populate('gameIds')
    .exec((err, mission) => {
      if (err) {
        if (err.name === 'CastError') {
          return res.status(400).send(err);
        }
        return res.status(500).send(err);
      }

      if (!mission)
        return res.status(404).end();

      res.json(mission);
    });
  },

  update(req, res) {
    Mission.findByIdAndUpdate(req.params.mission_id, req.body,
      { runValidators: true, context: 'query' },
      (err, mission) => {
        if (err) {
          if (err.name === 'CastError') {
            return res.status(400).send(err);
          }
          return res.status(500).send(err);
        }

        if (!mission)
          return res.status(404).end();

        res.status(204).end();
      });
  },

  delete(req, res) {
    Mission.findByIdAndRemove(req.params.mission_id, (err, mission) => {
      if (err) {
        if (err.name === 'CastError') {
          return res.status(400).send(err);
        }
        return res.status(500).send(err);
      }

      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    });
  },
};
