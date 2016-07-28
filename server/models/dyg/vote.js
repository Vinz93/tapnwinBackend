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
import Design from '../dyg/design';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Vote:
 *     properties:
 *       player:
 *         type: string
 *       design:
 *         type: string
 *       stickers:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Sticker'
 *         required:
 *           - animation
 *           - enable
 *           - disable
 *     required:
 *       - player
 *       - design
 */
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
  Design.findOne({
    _id: this.design,
    player: { $ne: this.player },
  })
  .then(design => {
    if (!design)
      return next(new ValidationError('Vote validation failed', {
        design: this.design,
      }));

    return Campaign.findOneActive({
      _id: design.campaign,
      'dyg.active': true,
      'dyg.stickers': { $all: this.stickers },
    });
  })
  .then(campaign => {
    if (!campaign)
      return next(new ValidationError('Vote validation failed', {
        campaign: this.campaign,
      }));

    next();
  })
  .catch(next);
});

VoteSchema.plugin(mongoosePaginate);
VoteSchema.plugin(idValidator);
VoteSchema.plugin(fieldRemover);

export default mongoose.model('Vote', VoteSchema);
