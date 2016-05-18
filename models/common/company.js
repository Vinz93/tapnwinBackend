/**
 * @author Juan Sanchez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

require('../../models/common/campaign');

const Campaign = mongoose.model('Campaign');

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  }
}, {
  timestamps: true
});

CompanySchema.methods = {};

CompanySchema.statics = {

  paginate: function (options, cb) {
    const model = this;
    const criteria = options.criteria || {};
    const offset = options.offset ? parseInt(options.offset) : 0;
    const limit = options.limit ? parseInt(options.limit) : 20;
    return model.find(criteria)
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(offset)
      .exec(function(err, data) {

        if(err)
          return cb(err);

        return model.count(criteria)
        .exec(function(err, total) {

          if(err)
            return cb(err);

          return cb(null, { data, total, limit, offset });
        });
      });
  }
};

CompanySchema.pre('remove', function (next) {

  Campaign.remove({ companyId: this._id }).exec(function(err) {

    if(err)
      next(err);

    next();
  });
});

CompanySchema.plugin(uniqueValidator);

mongoose.model('Company', CompanySchema);
