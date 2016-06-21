/**
 * @author Andres Alvarez
 * @description Vote model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

import ValidationError from '../../helpers/validationError';
import Campaign from '../common/campaign';
import Design from '../design/design';

const Schema = mongoose.Schema;

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
  Design.findById(this.design)
  .then(design => {
    const today = new Date();

    Campaign.findOne({
      _id: design.campaign,
      startAt: { $lt: today },
      finishAt: { $gte: today },
      'design.stickers': { $all: this.stickers },
    })
    .then(campaign => {
      if (!campaign)
        return next(new ValidationError('Vote validation failed'));

      next();
    })
    .catch(next);
  })
  .catch(next);
});

VoteSchema.plugin(mongoosePaginate);
VoteSchema.plugin(idValidator);
VoteSchema.plugin(fieldRemover);

export default mongoose.model('Vote', VoteSchema);
