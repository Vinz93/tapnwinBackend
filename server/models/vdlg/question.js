/**
 * @author Andres Alvarez
 * @description Question model definition
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
    return next(new APIError('Invalid time range', httpStatus.BAD_REQUEST));

  next();
});

QuestionSchema.pre('save', function (next) {
  Campaign.findOneActive({
    _id: this.campaign,
    'vdlg.active': true,
  })
  .then(campaign => {
    if (!campaign)
      return Promise.reject(new APIError('Invalid campaign', httpStatus.BAD_REQUEST));

    if (campaign.startAt > this.startAt || campaign.finishAt < this.finishAt)
      return Promise.reject(new APIError('Invalid time range', httpStatus.BAD_REQUEST));

    next();
  })
  .catch(next);
});

QuestionSchema.pre('remove', function (next) {
  Answer.remove({ campaign: this.id })
  .then(next)
  .catch(next);
});

QuestionSchema.plugin(mongoosePaginate);
QuestionSchema.plugin(idValidator);
QuestionSchema.plugin(fieldRemover);

export default mongoose.model('Question', QuestionSchema);
