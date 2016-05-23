/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const idValidator = require('mongoose-id-validator');
const ValidationError = require('../../helpers/validationError');
const Promise = require('bluebird');

require('../../models/common/mission');

const Mission = mongoose.model('Mission');

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
  if (this.finishAt <= this.startAt) {
    return next(new ValidationError('Invalid date range', {
      startAt: this.startAt,
      finishAt: this.finishAt,
    }));
  }
  next();
});

CampaignSchema.pre('save', function (next) {
  Campaign.find({
    $or: [{ startAt: { $lte: this.startAt }, finishAt: { $gte: this.startAt } },
    { startAt: { $lte: this.finishAt }, finishAt: { $gte: this.finishAt } },
    { startAt: { $gte: this.startAt }, finishAt: { $lte: this.finishAt } }],
    companyId: this.companyId,
  })
  .then(campaigns => {
    if (campaigns.length > 0) {
      return next(new ValidationError('Invalid date range', {
        startAt: this.startAt,
        finishAt: this.finishAt,
      }));
    }
    next();
  })
  .catch(next);
});

CampaignSchema.pre('save', function (next) {
  Promise.map(this.games, game =>
    Promise.map(game.missions, mission =>
      Mission.findById(mission.missionId)
      .then(missionDoc => {
        if (missionDoc.gameIds.indexOf(game.gameId) === -1) {
          return next(new ValidationError('Invalid date range', {
            gameId: game.gameId,
            missionId: mission.missionId,
          }));
        }
      })
    )
  )
  .then(next)
  .catch(next);
});
