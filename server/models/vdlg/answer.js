/**
 * @author Andres Alvarez
 * @description Answer model definition
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
import Question from './question';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Answer:
 *     properties:
 *       player:
 *         type: string
 *       question:
 *         type: string
 *       personal:
 *         type: integer
 *       popular:
 *         type: integer
 *     required:
 *       - player
 *       - question
 *       - personal
 *       - popular
 */
const AnswerSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  personal: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  popular: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  seen: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

AnswerSchema.index({
  player: 1,
  question: 1,
}, {
  unique: true,
});

AnswerSchema.pre('save', function (next) {
  Question.findById(this.question)
  .then(question => {
    const n = question.possibilities.length;
    const now = new Date();

    if (this.personal > n)
      return Promise.reject(new APIError('Invalid personal value', httpStatus.BAD_REQUEST));

    if (this.popular > n)
      return Promise.reject(new APIError('Invalid popular value', httpStatus.BAD_REQUEST));

    if (question.startAt > now || question.finishAt < now)
      return Promise.reject(new APIError('Inactive question', httpStatus.BAD_REQUEST));

    return Campaign.findOneActive({
      _id: question.campaign,
      'vdlg.active': true,
    });
  })
  .then(campaign => {
    if (!campaign)
      return Promise.reject(new APIError('Invalid campaign', httpStatus.BAD_REQUEST));

    if (campaign.vdlg.blockable)
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
  .catch(err => {
    if (err instanceof Promise.CancellationError)
      return;

    next(err);
  });
});

AnswerSchema.plugin(mongoosePaginate);
AnswerSchema.plugin(idValidator);
AnswerSchema.plugin(fieldRemover);

export default mongoose.model('Answer', AnswerSchema);
