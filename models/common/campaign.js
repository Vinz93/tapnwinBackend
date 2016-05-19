/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const idValidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const MissionsListSchema = new Schema({
  missionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mission',
  },
  isRequired: {
    type: Boolean,
    defualt: false,
  },
  isBlocking: {
    type: Boolean,
    defualt: false,
  },
  blockedTime: { // Minutes
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    min: [1, '`{VALUE}` is not a valid max'],
    default: 1,
  },
}, { _id: false });

const GamesListSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Game',
  },
  missions: [MissionsListSchema],
}, { _id: false });

const CampaignSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  games: [GamesListSchema],
  name: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  finishAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

CampaignSchema.methods = {};

CampaignSchema.statics = {};

CampaignSchema.pre('remove', next => {
  next();
});

CampaignSchema.plugin(mongoosePaginate);
CampaignSchema.plugin(idValidator);

const Campaign = mongoose.model('Campaign', CampaignSchema);

CampaignSchema.pre('save', function (next) {
  Campaign.find({
    $or: [{ startAt: { $lte: this.startAt }, finishAt: { $gte: this.startAt } },
    { startAt: { $lte: this.finishAt }, finishAt: { $gte: this.finishAt } }],
  })
  .then(campaigns => {
    if (campaigns.length > 0) {
      const err = new Error('InvalidDateRange');
      err.name = 'InvalidDateRange';
      return next(err);
    }
    next();
  })
  .catch(next);
});
