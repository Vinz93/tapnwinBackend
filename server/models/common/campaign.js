/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import Promise from 'bluebird';
import each from 'async/each';
import parallel from 'async/parallel';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import extend from 'mongoose-schema-extend'; // eslint-disable-line no-unused-vars
import fieldRemover from 'mongoose-field-remover';

import ValidationError from '../../helpers/validationError';

import MissionCampaign from './mission_campaign';
import Design from '../dyg/design';
import ModelAsset from '../dyg/model_asset';
import Sticker from '../dyg/sticker';
import Category from '../dyg/category';
import Item from '../dyg/item';

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  active: {
    type: Boolean,
    default: false,
  },
  blockable: {
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

const DYGSchema = GameSchema.extend({
  models: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ModelAsset',
  }],
  stickers: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Sticker',
  }],
  categories: [CategorySchema],
});

const VDLGSchema = GameSchema.extend({});

const M3Schema = GameSchema.extend({
  blockTime: {
    type: Number,
    default: 0,
  },
  initialMoves: {
    type: Number,
    default: 30,
  },
});

const DDTSchema = GameSchema.extend({});

/**
 * @swagger
 * definition:
 *   Campaign:
 *     properties:
 *       company:
 *         type: string
 *       name:
 *         type: string
 *       banner:
 *         type: string
 *       startAt:
 *         type: string
 *         format: date-time
 *       finishAt:
 *         type: string
 *         format: date-time
 *     required:
 *       - company
 *       - name
 *       - banner
 *       - startAt
 *       - finishAt
 */
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
  dyg: {
    type: DYGSchema,
    default: {},
  },
  vdlg: {
    type: VDLGSchema,
    default: {},
  },
  m3: {
    type: M3Schema,
    default: {},
  },
  ddt: {
    type: DDTSchema,
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
    return next(new ValidationError('Campaign validation failed', {
      startAt: this.startAt,
      finishAt: this.finishAt,
    }));
  }
  next();
});

CampaignSchema.pre('save', function (next) {
  if (!(this.isModified('startAt') || this.isModified('finishAt')))
    return next();

  Campaign.find({ // eslint-disable-line no-use-before-define
    $or: [
      {
        startAt: { $lte: this.startAt },
        finishAt: { $gte: this.startAt },
      },
      {
        startAt: { $lte: this.finishAt },
        finishAt: { $gte: this.finishAt },
      },
      {
        startAt: { $gte: this.startAt },
        finishAt: { $lte: this.finishAt },
      },
    ],
    company: this.company,
  })
  .then(campaigns => {
    if (campaigns.length > 0) {
      return next(new ValidationError('Campaign validation failed', {
        startAt: this.startAt,
        finishAt: this.finishAt,
      }));
    }
    next();
  })
  .catch(next);
});

CampaignSchema.pre('save', function (next) {
  if (!this.isModified('dyg'))
    return next();

  const company = this.company;

  const eachWrapper = (model, modelName, array, id, callback) => {
    each(array, (doc, cb) => {
      model.findOne({
        _id: id ? doc[id] : doc,
        company,
      })
      .then(model => {
        if (!model)
          return cb(new ValidationError('Campaign validation failed', {
            model: modelName,
            id: id ? doc[id] : doc,
          }));
        cb(null);
      })
      .catch(cb);
    }, callback);
  };

  parallel([
    cb => eachWrapper(ModelAsset, 'ModelAsset', this.dyg.models, null, cb),
    cb => eachWrapper(Sticker, 'Sticker', this.dyg.stickers, null, cb),
    cb => eachWrapper(Category, 'Category', this.dyg.categories, 'category', cb),
  ], err => {
    if (err)
      next(err);
    each(this.dyg.categories, (category, cb) => {
      eachWrapper(Item, 'Item', category.items, null, cb);
    }, next);
  });
});

CampaignSchema.plugin(mongoosePaginate);
CampaignSchema.plugin(idValidator);
CampaignSchema.plugin(fieldRemover);

const Campaign = mongoose.model('Campaign', CampaignSchema);

export default Campaign;
