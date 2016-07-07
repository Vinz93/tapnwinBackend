/**
 * @author Andres Alvarez
 * @description Vote model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import waterfall from 'async/waterfall';

import ValidationError from '../../helpers/validationError';
import Campaign from '../common/campaign';
import Design from '../dyg/design';

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
  waterfall([
    cb => {
      Design.findOne({
        _id: this.design,
        player: { $ne: this.player },
      })
      .then(design => cb(null, design))
      .catch(cb);
    },
    (design, cb) => {
      if (!design)
        return next(new ValidationError('Vote validation failed', {
          design: this.design,
        }));

      Campaign.findActive({
        _id: design.campaign,
        'dyg.active': true,
        'dyg.stickers': { $all: this.stickers },
      })
      .then(campaign => cb(null, campaign))
      .catch(cb);
    },
  ], (err, campaign) => {
    if (err)
      return next(err);

    if (!campaign)
      return next(new ValidationError('Vote validation failed', {
        campaign: this.campaign,
      }));

    next();
  });
});

VoteSchema.plugin(mongoosePaginate);
VoteSchema.plugin(idValidator);
VoteSchema.plugin(fieldRemover);

export default mongoose.model('Vote', VoteSchema);
