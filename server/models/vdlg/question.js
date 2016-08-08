/**
 * @author Andres Alvarez
 * @description Question model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import Promise from 'bluebird';

import ValidationError from '../../helpers/validation_error';
import Campaign from '../common/campaign';
import Answer from './answer';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Question:
 *     properties:
 *       campaign:
 *         type: string
 *       personal:
 *         type: string
 *       popular:
 *         type: string
 *       startAt:
 *         type: string
 *         format: date-time
 *       finishAt:
 *         type: string
 *         format: date-time
 *     required:
 *       - campaign
 *       - personal
 *       - popular
 *       - startAt
 *       - finishAt
 */
const QuestionSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  personal: {
    type: String,
    required: true,
  },
  popular: {
    type: String,
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  finishAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

QuestionSchema.pre('save', function (next) {
  if (this.startAt > this.finishAt)
    return next(new ValidationError('Invalid time range'));

  next();
});

QuestionSchema.pre('save', function (next) {
  Campaign.findById(this.campaign)
  .then(campaign => {
    if (!campaign.vdlg.active)
      return Promise.reject(new ValidationError('Inactive vdlg'));

    if (campaign.startAt > this.startAt || campaign.finishAt < this.finishAt)
      return Promise.reject(new ValidationError('Invalid time range'));

    next();
  })
  .catch(next);
});

QuestionSchema.pre('remove', function (next) {
  Answer.remove({ campaign: this.id })
  .then(next)
  .catch(next);
});

QuestionSchema.plugin(paginate);
QuestionSchema.plugin(idValidator);
QuestionSchema.plugin(fieldRemover);

export default mongoose.model('Question', QuestionSchema);
