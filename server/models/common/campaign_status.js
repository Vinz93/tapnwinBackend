/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

import ValidationError from '../../helpers/validationError';
import Campaign from './campaign';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   CampaignStatus:
 *     properties:
 *       player:
 *         type: string
 *       campaign:
 *         type: string
 *       balance:
 *         type: number
 *         format: float
 *       isBlocked:
 *         type: boolean
 *       unblockAt:
 *         type: string
 *         format: date-time
 *       m3:
 *         properties:
 *           isBlocked:
 *             type: boolean
 *           score:
 *             type: number
 *           move:
 *             type: number
 *     required:
 *       - player
 *       - campaign
 */
const CampaignStatusSchema = new Schema({
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
  balance: {
    type: Number,
    default: 0,
  },
  m3: {
    score: Number,
    moves: Number,
    isBlocked: Boolean,
    unblockAt: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  unblockAt: Date,
}, {
  timestamps: true,
});

CampaignStatusSchema.plugin(mongoosePaginate);
CampaignStatusSchema.plugin(idValidator);
CampaignStatusSchema.plugin(fieldRemover);

CampaignStatusSchema.post('findOne', function (campaignStatus, next) {
  if (campaignStatus) {
    let changed = false;

    if (campaignStatus.unblockAt && campaignStatus.unblockAt <= Date.now()) {
      changed = true;
      campaignStatus.isBlocked = false;
      campaignStatus.unblockAt = undefined;
    }

    if (campaignStatus.m3.unblockAt && campaignStatus.m3.unblockAt <= Date.now()) {
      changed = true;
      campaignStatus.m3.isBlocked = false;
      campaignStatus.m3.unblockAt = undefined;
    }

    if (changed)
      campaignStatus.save()
      .then(next)
      .catch(next);
    else
      next();
  } else {
    CampaignStatus.create(this.getQuery()) // eslint-disable-line no-use-before-define
    .then(next)
    .catch(next);
  }
});

CampaignStatusSchema.pre('save', function (next) {
  Campaign.findActive({
    _id: this.campaign,
  })
  .then(campaign => {
    if (!campaign)
      return next(new ValidationError('CampaignStatus validation failed', {
        campaign: this.campaign,
      }));

    if (this.m3.moves === undefined && campaign.m3.active) {
      this.m3.isBlocked = false;
      this.m3.moves = campaign.m3.initialMoves;
      this.m3.score = 0;
    } else if (this.m3.moves <= 0) {
      this.m3.isBlocked = true;
      this.m3.unblockAt = Date.now() + campaign.m3.blockTime;
      this.m3.moves = campaign.m3.initialMoves;
    }

    next();
  })
  .catch(next);
});

const CampaignStatus = mongoose.model('CampaignStatus', CampaignStatusSchema);

export default CampaignStatus;
