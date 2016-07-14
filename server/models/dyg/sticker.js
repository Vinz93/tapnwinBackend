/**
 * @author Andres Alvarez
 * @description Category model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const isURL = validate({
  validator: 'isURL',
  message: 'not a valid url',
});

/**
 * @swagger
 * definition:
 *   Sticker:
 *     properties:
 *       company:
 *         type: string
 *       name:
 *         type: string
 *       isPositive:
 *         type: boolean
 *       urls:
 *         properties:
 *           animation:
 *             type: string
 *           enable:
 *             type: string
 *           disable:
 *             type: string
 *         required:
 *           - animation
 *           - enable
 *           - disable
 *     required:
 *       - company
 *       - name
 *       - isPositive
 */
const StickerSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isPositive: {
    type: Boolean,
    required: true,
  },
  urls: {
    animation: {
      type: String,
      required: true,
      validate: isURL,
    },
    enable: {
      type: String,
      required: true,
      validate: isURL,
    },
    disable: {
      type: String,
      required: true,
      validate: isURL,
    },
  },
}, {
  timestamps: true,
});

StickerSchema.plugin(mongoosePaginate);
StickerSchema.plugin(idValidator);
StickerSchema.plugin(fieldRemover);

export default mongoose.model('Sticker', StickerSchema);
