/**
 * @author Juan Sanchez
 * @description Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import extend from 'mongoose-schema-extend'; // eslint-disable-line no-unused-vars
import Promise from 'bluebird';

import { removeIterative } from '../../helpers/utils';
import ValidationError from '../../helpers/validation_error';
import CampaignStatus from './campaign_status';
import MissionCampaign from './mission_campaign';
import Design from '../dyg/design';
import ModelAsset from '../dyg/model_asset';
import Sticker from '../dyg/sticker';
import Category from '../dyg/category';
import Item from '../dyg/item';
import Question from '../vdlg/question';

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
  isActive: {
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
 *         type: array
 *         items:
 *           type: string
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
 *           catalog:
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
    default: 0.1,
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
 *       dyg:
 *         $ref: '#/definitions/DygGame'
 *       vdlg:
 *         $ref: '#/definitions/VdlgGame'
 *       m3:
 *         $ref: '#/definitions/M3Game'
 *       ddt:
 *         $ref: '#/definitions/DdtGame'
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
  findOneActive(criteria) {
    const now = new Date();
    const find = Object.assign(criteria || {}, {
      startAt: { $lt: now },
      finishAt: { $gte: now },
    });

    return this.findOne(find);
  },
};

CampaignSchema.methods = {
  isActive() {
    const now = Date.now();

    return this.startAt.getTime() < now && this.finishAt.getTime() >= now;
  },
};

CampaignSchema.pre('save', function (next) {
  if (!this.isModified('startAt') && !this.isModified('finishAt'))
    return next();

  if (this.finishAt <= this.startAt)
    return next(new ValidationError('Invalid active time range'));

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
      return Promise.reject(new ValidationError('Overlapping active time range'));

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
        return new ValidationError(`Invalid ${name}`);
    });
  });

  Promise.all([
    validate(ModelAsset, 'modelAsset', this.dyg.models, null),
    validate(Sticker, 'sticker', this.dyg.stickers, null),
    validate(Category, 'category', this.dyg.catalog, 'category'),
  ])
  .then(() => {
    Promise.each(this.dyg.catalog, catalog => validate(Item, 'item', catalog.items, null))
    .then(next)
    .catch(next);
  })
  .catch(next);
});

CampaignSchema.post('remove', function (next) {
  const campaign = this.id;

  Promise.all([
    Design.find({ campaign }).then(designs => removeIterative(designs)),
    Question.find({ campaign }).then(questions => removeIterative(questions)),
    MissionCampaign.find({ campaign }).then(missionCampaign => removeIterative(missionCampaign)),
    CampaignStatus.remove({ campaign }),
  ])
  .then(next)
  .catch(next);
});

CampaignSchema.plugin(paginate);
CampaignSchema.plugin(idValidator);
CampaignSchema.plugin(fieldRemover);

const Campaign = mongoose.model('Campaign', CampaignSchema);

export default Campaign;
