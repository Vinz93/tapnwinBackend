/**
 * @author Andres Alvarez
 * @description Answer model definition
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
      return Promise.reject(new ValidationError('Invalid personal value'));

    if (this.popular > n)
      return Promise.reject(new ValidationError('Invalid popular value'));

    if (question.startAt > now || question.finishAt < now)
      return Promise.reject(new ValidationError('Inactive question'));

    return Campaign.findById(question.campaign);
  })
  .then(campaign => {
    if (!campaign.isActive())
      return Promise.reject(new ValidationError('Inactive campaign'));

    if (!campaign.vdlg.active)
      return Promise.reject(new ValidationError('Inactive vdlg'));

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
      return Promise.reject(new ValidationError('Blocked vdlg'));

    next();
  })
  .catch(err => {
    if (err instanceof Promise.CancellationError)
      return;

    next(err);
  });
});

AnswerSchema.plugin(paginate);
AnswerSchema.plugin(idValidator);
AnswerSchema.plugin(fieldRemover);

export default mongoose.model('Answer', AnswerSchema);
