/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from '../../helpers/fieldRemover';

const Schema = mongoose.Schema;

const StickerSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
  },
  isPositive: {
    type: Boolean,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: validate({
      validator: 'isURL',
      message: 'The url provided is not valid.',
    }),
  },
}, {
  timestamps: true,
});

StickerSchema.plugin(mongoosePaginate);
StickerSchema.plugin(idValidator);
StickerSchema.plugin(fieldRemover);

export default mongoose.model('Sticker', StickerSchema);
