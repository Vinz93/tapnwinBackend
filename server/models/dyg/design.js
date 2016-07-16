/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import random from 'mongoose-random';

import ValidationError from '../../helpers/validationError';
import Campaign from '../common/campaign';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Design:
 *     properties:
 *       player:
 *         type: string
 *       campaign:
 *         type: string
 *       model:
 *         type: string
 *       topItem:
 *         type: string
 *       midItem:
 *         type: string
 *       botItem:
 *         type: string
 *     required:
 *       - player
 *       - campaign
 *       - model
 *       - topItem
 *       - midItem
 *       - botItem
 */
const DesignSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  model: {
    type: Schema.Types.ObjectId,
    ref: 'ModelAsset',
    required: true,
  },
  topItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  midItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  botItem: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
}, {
  timestamps: true,
});

DesignSchema.pre('save', function (next) {
  Campaign.findActive({
    _id: this.campaign,
    $and: [
      { 'dyg.active': true },
      { 'dyg.models': this.model },
      { 'dyg.categories.items': { $all: [
        this.botItem,
        this.midItem,
        this.topItem,
      ] } },
    ],
  })
  .then(campaign => {
    if (!campaign)
      return next(new ValidationError('Design validation failed', {
        campaign: this.campaign,
      }));

    next();
  })
  .catch(next);
});

DesignSchema.plugin(mongoosePaginate);
DesignSchema.plugin(idValidator);
DesignSchema.plugin(fieldRemover, 'random');
DesignSchema.plugin(random);

export default mongoose.model('Design', DesignSchema);
