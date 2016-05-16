/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

require('../../models/common/company');

const Company = mongoose.model('Company');


module.exports = {

  readAll: function(req, res) {

    Company.paginate({
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

    Company.create(req.body, function (err, json) {

      if (err) {
        if (err.name === 'ValidationError')
          return res.status(400).json(err);
        else
          return res.status(500).send(err);
      }

      res.json(json).status(201).end();
    });
  },

  read: function(req, res) {

    Company.findById(req.params.company_id)
    .exec(function (err, company) {

      if (err)
        return res.status(500).send(err);

      if (!company)
        return res.status(404).end();

      res.json(company);
    });
  },

  update: function(req, res) {

    Company.findByIdAndUpdate(req.params.company_id, req.body,
      { runValidators: true, context: 'query' },
      function (err, company) {

      if (err)
        return res.status(500).send(err);

      if (!company)
        return res.status(404).end();

      res.status(204).end();
    });
  },

  delete: function(req, res) {

    Company.findByIdAndRemove(req.params.company_id, function (err, company) {

      if (err)
        return res.status(500).send(err);

      if (!company)
        return res.status(404).end();

      res.status(204).end();
    });
  },


  check: function (req, res, next) {

    Company.findById(req.params.company_id)
    .exec(function (err, company) {

      if (err)
        return res.status(500).send(err);

      if (!company)
        return res.status(404).end();

      next();
    });
  }
};
