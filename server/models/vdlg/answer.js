/**
 * @author Andres Alvarez
 * @description Answer model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import waterfall from 'async/waterfall';

import ValidationError from '../../helpers/validationError';
import Campaign from '../common/campaign';
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
  waterfall([
    cb => {
      Question.findById(this.question)
      .then(question => cb(null, question))
      .catch(cb);
    },
    (question, cb) => {
      const n = question.possibilities.length;
      const now = new Date();

      if (this.personal > n)
        return next(new ValidationError('Answer validation failed', { personal: this.personal }));

      if (this.popular > n)
        return next(new ValidationError('Answer validation failed', { popular: this.popular }));

      if (question.startAt > now || question.finishAt < now)
        return next(new ValidationError('Answer validation failed', {
          startAt: this.startAt,
          finishAt: this.finishAt,
        }));

      Campaign.findOneActive({
        _id: question.campaign,
        'vdlg.active': true,
      })
      .then(campaign => cb(null, campaign))
      .catch(cb);
    },
  ], (err, campaign) => {
    if (err)
      next(err);

    if (!campaign)
      return next(new ValidationError('Answer validation failed', { campaign }));

    next();
  });
});

AnswerSchema.plugin(mongoosePaginate);
AnswerSchema.plugin(idValidator);
AnswerSchema.plugin(fieldRemover);

export default mongoose.model('Answer', AnswerSchema);
