'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  }
}, {
  timestamps: true
});

GameSchema.statics = {

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

GameSchema.plugin(uniqueValidator);

mongoose.model('Game', GameSchema);
