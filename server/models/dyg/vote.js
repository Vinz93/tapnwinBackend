/**
 * @author Andres Alvarez
 * @description Vote model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import Promise from 'bluebird';

import ValidationError from '../../helpers/validation_error';
import Campaign from '../common/campaign';
import CampaignStatus from '../common/campaign_status';
import Design from '../dyg/design';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Vote:
 *     properties:
 *       player:
 *         type: string
 *       design:
 *         type: string
 *       stickers:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Sticker'
 *         required:
 *           - animation
 *           - enable
 *           - disable
 *     required:
 *       - player
 *       - design
 */
const VoteSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  design: {
    type: Schema.Types.ObjectId,
    ref: 'Design',
    required: true,
  },
  stickers: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Sticker',
    }],
  },
}, {
  timestamps: true,
});

VoteSchema.index({
  player: 1,
  design: 1,
}, {
  unique: true,
});

VoteSchema.pre('save', function (next) {
  Design.findOne({
    _id: this.design,
    player: { $ne: this.player },
  })
  .then(design => {
    if (!design)
      return Promise.reject(new ValidationError('Invalid design'));

    return Campaign.findOne({
      _id: design.campaign,
      'dyg.stickers': { $all: this.stickers },
    });
  })
  .then(campaign => {
    if (!campaign)
      return Promise.reject(new ValidationError('Invalid stickers combination'));

    if (!campaign.isActive())
      return Promise.reject(new ValidationError('Inactive campaign'));

    if (!campaign.dyg.isActive)
      return Promise.reject(new ValidationError('Inactive dyg'));

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
      return Promise.reject(new ValidationError('Blocked dyg'));

    next();
  })
  .catch(next);
});

VoteSchema.plugin(paginate);
VoteSchema.plugin(idValidator);
VoteSchema.plugin(fieldRemover);

export default mongoose.model('Vote', VoteSchema);
