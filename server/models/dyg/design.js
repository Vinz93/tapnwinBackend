/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import random from 'mongoose-random';
import Promise from 'bluebird';

import ValidationError from '../../helpers/validation_error';
import Campaign from '../common/campaign';
import CampaignStatus from '../common/campaign_status';
import Vote from './vote';

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
  Campaign.findOne({
    _id: this.campaign,
    'dyg.models': this.model,
  })
  .then(campaign => {
    if (!campaign)
      return Promise.reject(new ValidationError('Invalid model'));

    if (!campaign.isActive())
      return Promise.reject(new ValidationError('Inactive campaign'));

    if (!campaign.dyg.isActive)
      return Promise.reject(new ValidationError('Inactive dyg'));

    const items = this.items;
    const dyg = campaign.dyg;

    if (items.length !== campaign.dyg.zones.length)
      return Promise.reject(new ValidationError('Invalid item combination'));

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item === null && !dyg.zones[i].isRequired)
        continue;

      const categories = dyg.zones[i].categories;
      let found = false;

      for (let j = 0; j < categories.length; j++) {
        const category = categories[j];

        for (let w = 0; w < dyg.catalog.length; w++) {
          const entry = dyg.catalog[w];

          if (category.equals(entry.category) && entry.items.indexOf(item) >= 0) {
            found = true;
            break;
          }
        }

        if (found)
          break;
      }

      if (!found)
        return Promise.reject(new ValidationError('Invalid item combination'));
    }

    if (campaign.dyg.blockable)
      return CampaignStatus.findOrCreate({
        player: this.player,
        campaign: campaign.id,
      });

    next();
    throw new Promise.CancellationError();
  })
  .then(campaignStatus => {
    if (campaignStatus.isBlocked)
      return Promise.reject(new ValidationError('Blocked game'));

    next();
  })
  .catch(err => {
    if (err instanceof Promise.CancellationError)
      return;

    next(err);
  });
});

DesignSchema.post('remove', function (next) {
  Vote.remove({ design: this.id })
  .then(next)
  .catch(next);
});

DesignSchema.plugin(paginate);
DesignSchema.plugin(idValidator);
DesignSchema.plugin(fieldRemover, 'random');
DesignSchema.plugin(random);

export default mongoose.model('Design', DesignSchema);
