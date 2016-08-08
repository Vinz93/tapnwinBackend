/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import timeUnit from 'time-unit';
import Promise from 'bluebird';

import ValidationError from '../../helpers/validation_error';
import Campaign from './campaign';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   M3Status:
 *     properties:
 *       score:
 *         type: string
 *       moves:
 *         type: string
 *       isBlocked:
 *         type: boolean
 */
const M3StatusSchema = new Schema({
  score: Number,
  moves: Number,
  isBlocked: Boolean,
  unblockAt: Date,
}, { _id: false });

M3StatusSchema.plugin(fieldRemover);

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
 *       m3:
 *         $ref: '#/definitions/M3Status'
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
  isBlocked: {
    type: Boolean,
    default: false,
  },
  unblockAt: Date,
  m3: {
    type: M3StatusSchema,
    default: {},
  },
}, {
  timestamps: true,
});

CampaignStatusSchema.index({
  player: 1,
  campaign: 1,
}, {
  unique: true,
});

CampaignStatusSchema.plugin(paginate);
CampaignStatusSchema.plugin(idValidator);
CampaignStatusSchema.plugin(fieldRemover, 'unblockAt');

CampaignStatusSchema.statics = {
  findOrCreate(find) {
    return this.findOne(find)
    .then(campaignStatus => {
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
          return campaignStatus.save();

        return new Promise.resolve(campaignStatus); // eslint-disable-line new-cap
      }

      return this.create(find);
    });
  },
};

CampaignStatusSchema.pre('save', function (next) {
  Campaign.findById(this.campaign)
  .then(campaign => {
    if (!campaign.isActive())
      return Promise.reject(new ValidationError('Inactive campaign'));

    if (this.m3.moves === undefined && campaign.m3.active) {
      this.m3.isBlocked = false;
      this.m3.moves = campaign.m3.initialMoves;
      this.m3.score = 0;
    } else if (this.isModified('m3')) {
      if (!campaign.m3.active)
        return Promise.reject(new ValidationError('Inactive m3'));

      if (this.m3.moves <= 0) {
        this.m3.isBlocked = true;
        this.m3.unblockAt = Date.now() + timeUnit.hours.toMillis(campaign.m3.blockTime);
        this.m3.moves = campaign.m3.initialMoves;
      }
    }

    next();
  })
  .catch(next);
});

const CampaignStatus = mongoose.model('CampaignStatus', CampaignStatusSchema);

export default CampaignStatus;
