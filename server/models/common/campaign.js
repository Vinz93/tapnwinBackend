/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import ValidationError from '../../helpers/validationError';
import fieldRemover from 'mongoose-field-remover';
import Promise from 'bluebird';
import config from '../../../config/env';

import Mission from '../../models/common/mission';

const Schema = mongoose.Schema;

const MissionsListSchema = new Schema({
  mission: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mission',
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isBlocking: {
    type: Boolean,
    default: false,
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

/* const GamesListSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Game',
  },
  missions: [MissionsListSchema],
}, { _id: false });*/

const DesignSchema = new Schema({
  missions: [MissionsListSchema],
  models: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Model',
  }],
  stickers: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Sticker',
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  }],
}, { _id: false });

const VoiceSchema = new Schema({
  missions: [MissionsListSchema],
}, { _id: false });

const Match3Schema = new Schema({
  missions: [MissionsListSchema],
}, { _id: false });

const OwnerSchema = new Schema({
  missions: [MissionsListSchema],
}, { _id: false });

const CampaignSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  // games: [GamesListSchema],
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
  design: DesignSchema,
  voice: VoiceSchema,
  match3: Match3Schema,
  owner: OwnerSchema,
}, {
  timestamps: true,
});

CampaignSchema.pre('remove', next => {
  next();
});

CampaignSchema.plugin(mongoosePaginate);
CampaignSchema.plugin(idValidator);
CampaignSchema.plugin(fieldRemover);

const Campaign = mongoose.model('Campaign', CampaignSchema);

CampaignSchema.pre('save', function (next) {
  if (this.finishAt <= this.startAt) {
    return next(new ValidationError('InvalidDateRange', {
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
    company: this.company,
  })
  .then(campaigns => {
    if (campaigns.length > 0) {
      return next(new ValidationError('InvalidDateRange', {
        startAt: this.startAt,
        finishAt: this.finishAt,
      }));
    }
    next();
  })
  .catch(next);
});

CampaignSchema.pre('save', function (next) {
  Promise.map(config.games, game =>
    Promise.map(this[game.name].missions, mission =>
      Mission.findById(mission.mission)
      .then(missionDoc => {
        if (missionDoc.games.indexOf(game.id) === -1) {
          return next(new ValidationError('MissionsGameDontMatch', {
            game: game.name,
            mission: missionDoc.description,
          }));
        }
      })
    )
  )
  .then(next)
  .catch(next);
});

export default Campaign;
