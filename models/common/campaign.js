/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MissionsListSchema = new Schema({
  missionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mission'
  },
  isRequired: {
    type: Boolean,
    defualt: false
  },
  isBlocking: {
    type: Boolean,
    defualt: false
  },
  blockedTime: { // Minutes
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    min: [1, '`{VALUE}` is not a valid max'],
    default: 1
  }
}, { _id: false });

const GamesListSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Game'
  },
  missions: [MissionsListSchema]
}, { _id: false });

const CampaignSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  },
  games: [GamesListSchema],
  name: {
    type: String,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  finishAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

CampaignSchema.methods = {};

CampaignSchema.statics = {

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

CampaignSchema.pre('remove', function (next) {
  next();
});

mongoose.model('Campaign', CampaignSchema);
