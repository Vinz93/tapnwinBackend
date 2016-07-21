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
 *       items:
 *         type: array
 *         items:
 *           type: string
 *     required:
 *       - player
 *       - campaign
 *       - model
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
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  }],
}, {
  timestamps: true,
});

DesignSchema.pre('save', function (next) {
  Campaign.findOneActive({
    _id: this.campaign,
    $and: [
      { 'dyg.active': true },
      { 'dyg.models': this.model },
    ],
  })
  .then(campaign => {
    if (!campaign)
      return next(new ValidationError('Design validation failed', {
        campaign: this.campaign,
      }));
    /*
    const items = this.items;
    const dyg = campaign.dyg;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const categories = dyg.zones[i].categories;
      let found = false;

      for (let j = 0; j < categories.length; j++) {
        const category = categories[j];

        for (let w = 0; w < dyg.categories.length; w++) {
          const object = dyg.categories[w];

          if (category === object.category && object.items.includes(item)) {
            found = true;
            break;
          }
        }

        if (!found)
          break;
      }

      if (!found)
        return next(new ValidationError('Design validation failed', {
          campaign: this.campaign,
        }));
    }
    */
    next();
  })
  .catch(next);
});

DesignSchema.plugin(mongoosePaginate);
DesignSchema.plugin(idValidator);
DesignSchema.plugin(fieldRemover, 'random');
DesignSchema.plugin(random);

export default mongoose.model('Design', DesignSchema);
