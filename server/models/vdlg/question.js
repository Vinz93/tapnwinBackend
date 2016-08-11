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
 *       inbox:
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
  inbox: {
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
  if (!this.isModified('startAt') && !this.isModified('finishAt'))
    return next();

  const startAt = this.startAt.getTime();
  const finishAt = this.finishAt.getTime();

  if (startAt > finishAt)
    return next(new ValidationError('Invalid time range'));

  Campaign.findById(this.campaign)
  .then(campaign => {
    if (campaign.startAt.getTime() > startAt || campaign.finishAt.getTime() < finishAt)
      return Promise.reject(new ValidationError('Invalid time range'));

    next();
  })
  .catch(next);
});

QuestionSchema.post('remove', function (next) {
  Answer.remove({ question: this.id })
  .then(next)
  .catch(next);
});

QuestionSchema.plugin(paginate);
QuestionSchema.plugin(idValidator);
QuestionSchema.plugin(fieldRemover);

export default mongoose.model('Question', QuestionSchema);
