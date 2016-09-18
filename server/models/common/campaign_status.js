/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Carlos Avilan
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
 *         type: number
 *       moves:
 *         type: number
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
 *   DygStatus:
 *     properties:
 *       votesGiven:
 *         type: number
 *       votesReceived:
 *         type: number
 *       dressed:
 *         type: number
 *       isBlocked:
 *         type: boolean
 */
const DygStatusSchema = new Schema({
  votesGiven: Number,
  votesReceived: Number,
  dressed: Number,
  isBlocked: Boolean,
  unblockAt: Date,
}, { _id: false });

DygStatusSchema.plugin(fieldRemover);

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
 *       dyg:
 *         $ref: '#/definitions/DygStatus'
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
    default: true,
  },
  unblockAt: Date,
  m3: {
    type: M3StatusSchema,
    default: {},
  },
  dyg: {
    type: DygStatusSchema,
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
        const now = Date.now();
        let changed = false;

        if (campaignStatus.unblockAt && campaignStatus.unblockAt.getTime() <= now) {
          changed = true;
          campaignStatus.isBlocked = false;
          campaignStatus.unblockAt = undefined;
        }

        if (campaignStatus.m3.unblockAt && campaignStatus.m3.unblockAt.getTime() <= now) {
          changed = true;
          campaignStatus.m3.isBlocked = false;
          campaignStatus.m3.unblockAt = undefined;
        }

        if (campaignStatus.dyg.unblockAt && campaignStatus.dyg.unblockAt.getTime() <= now) {
          changed = true;
          campaignStatus.dyg.isBlocked = false;
          campaignStatus.dyg.unblockAt = undefined;
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

    if (this.m3.moves === undefined && campaign.m3.isActive) {
      this.m3.isBlocked = false;
      this.m3.moves = campaign.m3.initialMoves;
      this.m3.score = 0;
    } else if (this.isModified('m3')) {
      if (!campaign.m3.isActive)
        return Promise.reject(new ValidationError('Inactive m3'));

      if (this.m3.moves <= 0) {
        this.m3.isBlocked = true;
        this.m3.unblockAt = new Date(Date.now() + timeUnit.hours.toMillis(campaign.m3.blockTime));
        this.m3.moves = campaign.m3.initialMoves;
      }
    }

    if (this.dyg.dressed === undefined && campaign.dyg.isActive) {
      this.dyg.isBlocked = false;
      this.dyg.votesGiven = 0;
      this.dyg.votesReceived = 0;
      this.dyg.dressed = 0;
    }

    next();
  })
  .catch(next);
});

const CampaignStatus = mongoose.model('CampaignStatus', CampaignStatusSchema);

export default CampaignStatus;
