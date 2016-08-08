/**
 * @author Andres Alvarez
 * @description Vote model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../../helpers/api_error';
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
      return Promise.reject(new APIError('Invalid design', httpStatus.BAD_REQUEST));

    return Campaign.findOneActive({
      _id: design.campaign,
      'dyg.active': true,
      'dyg.stickers': { $all: this.stickers },
    });
  })
  .then(campaign => {
    if (!campaign)
      return Promise.reject(new APIError('Invalid campaign', httpStatus.BAD_REQUEST));

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
      return Promise.reject(new APIError('Blocked game', httpStatus.BAD_REQUEST));

    next();
  })
  .catch(next);
});

VoteSchema.plugin(mongoosePaginate);
VoteSchema.plugin(idValidator);
VoteSchema.plugin(fieldRemover);

export default mongoose.model('Vote', VoteSchema);
