/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import extend from 'mongoose-schema-extend'; // eslint-disable-line no-unused-vars
import ValidationError from '../../helpers/validationError';
import fieldRemover from 'mongoose-field-remover';
import Promise from 'bluebird';
import config from '../../../config/env';

import Mission from './mission';

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

const GameSchema = new Schema({
  active: {
    type: Boolean,
    default: false,
  },
  missions: [MissionsListSchema],
}, { _id: false });

const DesignSchema = GameSchema.extend({
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
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    items: [{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Item',
    }],
  }],
});

const VoiceSchema = GameSchema.extend({});

const Match3Schema = GameSchema.extend({});

const OwnerSchema = GameSchema.extend({});

const CampaignSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
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
  design: {
    type: DesignSchema,
    default: {},
  },
  voice: {
    type: VoiceSchema,
    default: {},
  },
  match3: {
    type: Match3Schema,
    default: {},
  },
  owner: {
    type: OwnerSchema,
    default: {},
  },
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
