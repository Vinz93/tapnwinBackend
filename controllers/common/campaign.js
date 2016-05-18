/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

require('../../models/common/campaign');

const Campaign = mongoose.model('Campaign');

module.exports = {

  readAll: function (req, res) {

    Campaign.paginate({
      limit: req.query.limit,
      offset: req.query.offset,
      criteria: req.query.criteria
    }, function (err, json) {

      if (err)
        return res.status(500).send(err);

      res.json(json).end();
    });
  },

  createByACompany: function (req, res) {

  },

  readByACompany: function (req, res) {

  },

  read: function (req, res) {

  },

  update: function (req, res) {

  },

  delete: function (req, res) {

  },
};
