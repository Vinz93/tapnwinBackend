'use strict';

require('../../models/common/administrator');

const mongoose = require('mongoose');

const Administrator = mongoose.model('Administrator');

module.exports = {
  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Administrator.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(administrators => res.json(administrators))
    .catch(err => res.status(500).send(err));
  },
  create(req, res) {
    Administrator.create(req.body)
    .then(administrator => res.status(201).json(administrator))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
};
