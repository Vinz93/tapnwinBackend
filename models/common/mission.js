'use strict';

const mongoose = require('mongoose');

const Promise = require('bluebird');

mongoose.Promise = Promise;

require('../../models/common/game');

const Game = mongoose.model('Game');

const Schema = mongoose.Schema;

const MissionSchema = new Schema({
  gameIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

MissionSchema.statics = {

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

MissionSchema.pre('save', function (next) {

  Promise.map(this.gameIds, function(current) {

    return new Promise(function(resolve, reject) {

      Game.findById(current)
      .then(function(game) {
        if(!game){
          let err = new Error( current + ' is not a valid Game' );
          err.name = 'ValidationError';
          err.description = current + ' is not a valid Game';
          reject(err);
        }else{
          resolve();
        }
      })
      .catch(function(err) {
        reject(err);
      });
    });
  }).then(function() {
    next();
  }).catch(function(err) {
    next(err);
  });
});

mongoose.model('Mission', MissionSchema);
