/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import extend from 'mongoose-schema-extend'; // eslint-disable-line no-unused-vars
import assignment from 'assignment';

import ValidationError from '../../helpers/validationError';
import MissionCampaign from './mission_campaign';
import Design from '../dyg/design';
import ModelAsset from '../dyg/model_asset';
import Sticker from '../dyg/sticker';
import Category from '../dyg/category';
import Item from '../dyg/item';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Catalog:
 *     properties:
 *       category:
 *         type: string
 *       items:
 *         type: array
 *         items:
 *           type: string
 */
const CatalogSchema = new Schema({
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

/**
 * @swagger
 * definition:
 *   Game:
 *     properties:
 *       isActive:
 *         type: boolean
 *       blockable:
 *         type: boolean
 */
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

/**
 * @swagger
 * definition:
 *   Zone:
 *     properties:
 *       categories:
 *         type: string
 *       isRequired:
 *         type: boolean
 */
const ZoneSchema = new Schema({
  categories: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  }],
  isRequired: {
    type: Boolean,
    default: true,
  },
}, { _id: false });

/**
 * @swagger
 * definition:
 *   DygGame:
 *     allOf:
 *       - $ref: '#/definitions/Game'
 *       - properties:
 *           models:
 *             type: array
 *             items:
 *               type: string
 *           stickers:
 *             type: array
 *             items:
 *               type: string
 *           categories:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Catalog'
 *           zones:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Zone'
 */
const DygGameSchema = GameSchema.extend({
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
  catalog: [CatalogSchema],
  zones: [ZoneSchema],
});

/**
 * @swagger
 * definition:
 *   VdlgGame:
 *     $ref: '#/definitions/Game'
 */
const VdlgGameSchema = GameSchema.extend({});

/**
 * @swagger
 * definition:
 *   M3Game:
 *     allOf:
 *       - $ref: '#/definitions/Game'
 *       - properties:
 *           blockTime:
 *             type: integer
 *           initialMoves:
 *             type: integer
 */
const M3GameSchema = GameSchema.extend({
  blockTime: {
    type: Number,
    default: 60000,
  },
  initialMoves: {
    type: Number,
    default: 30,
  },
});

/**
 * @swagger
 * definition:
 *   DdtGame:
 *     $ref: '#/definitions/Game'
 */
const DdtGameSchema = GameSchema.extend({});

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
    type: DygGameSchema,
    default: {},
  },
  vdlg: {
    type: VdlgGameSchema,
    default: {},
  },
  m3: {
    type: M3GameSchema,
    default: {},
  },
  ddt: {
    type: DdtGameSchema,
    default: {},
  },
}, {
  timestamps: true,
});

CampaignSchema.statics = {
  findOneActive(find) {
    const today = new Date();

    assignment(find || {}, {
      startAt: { $lt: today },
      finishAt: { $gte: today },
    });

    return this.findOne(find);
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
  if (this.finishAt <= this.startAt)
    return next(new ValidationError('Campaign validation failed', {
      startAt: this.startAt,
      finishAt: this.finishAt,
    }));

  next();
});

CampaignSchema.pre('save', function (next) {
  if (!this.isModified('startAt') && !this.isModified('finishAt'))
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
    if (campaigns.length > 0)
      return next(new ValidationError('Campaign validation failed', {
        startAt: this.startAt,
        finishAt: this.finishAt,
      }));

    next();
  })
  .catch(next);
});

CampaignSchema.pre('save', function (next) {
  if (!this.isModified('dyg'))
    return next();

  const company = this.company;

  const validate = (model, name, array, id) => Promise.each(array, doc => {
    model.findOne({
      _id: id ? doc[id] : doc,
      company,
    })
    .then(model => {
      if (!model)
        return new ValidationError('Campaign validation failed', {
          model: name,
          id: id ? doc[id] : doc,
        });
    });
  });

  Promise.all([
    validate(ModelAsset, 'ModelAsset', this.dyg.models, null),
    validate(Sticker, 'Sticker', this.dyg.stickers, null),
    validate(Category, 'Category', this.dyg.catalog, 'category'),
  ])
  .then(() => {
    Promise.each(this.dyg.catalog, catalog => validate(Item, 'Item', catalog.items, null))
    .then(next)
    .catch(next);
  })
  .catch(next);
});

CampaignSchema.plugin(paginate);
CampaignSchema.plugin(idValidator);
CampaignSchema.plugin(fieldRemover);

const Campaign = mongoose.model('Campaign', CampaignSchema);

export default Campaign;
