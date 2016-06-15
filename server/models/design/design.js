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
  const today = new Date();

  Campaign.findOne({
    _id: this.campaign,
    startAt: {
      $lt: today,
    },
    finishAt: {
      $gte: today,
    },
  })
  .then(campaign => {
    if (!campaign)
      return next(new ValidationError('NotActiveCampaign'));

    next();
  })
  .catch(next);
});

DesignSchema.plugin(mongoosePaginate);
DesignSchema.plugin(idValidator);
DesignSchema.plugin(fieldRemover, 'random');
DesignSchema.plugin(random);

export default mongoose.model('Design', DesignSchema);
