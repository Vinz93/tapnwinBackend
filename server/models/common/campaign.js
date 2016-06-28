/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import extend from 'mongoose-schema-extend'; // eslint-disable-line no-unused-vars
import fieldRemover from 'mongoose-field-remover';

// import config from '../../../config/env';
import ValidationError from '../../helpers/validationError';
// import Mission from './mission';
import MissionCampaign from './missionCampaign';
import Design from '../design/design';

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  active: {
    type: Boolean,
    default: false,
  },
  canBeBlocked: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const CategorySchema = new Schema({
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
  categories: [CategorySchema],
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
  balance: {
    type: Number,
    default: 0,
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

CampaignSchema.statics = {
  findActive(criteria) {
    const today = new Date();

    Object.assign(criteria || {}, {
      startAt: { $lt: today },
      finishAt: { $gte: today },
    });

    return this.findOne(criteria);
  },
};

CampaignSchema.pre('remove', function (next) {
  Promise.all([
    Design.remove({ campaign: this.id }),
    MissionCampaign.remove({ campaign: this.id }),
  ])
  .then(next)
  .catch(next);
});

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
  Campaign.find({ // eslint-disable-line no-use-before-define
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

CampaignSchema.plugin(mongoosePaginate);
CampaignSchema.plugin(idValidator);
CampaignSchema.plugin(fieldRemover);

const Campaign = mongoose.model('Campaign', CampaignSchema);

export default Campaign;
