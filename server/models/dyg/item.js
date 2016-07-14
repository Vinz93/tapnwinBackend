/**
 * @author Andres Alvarez
 * @description Item model definition
 * @lastModifiedBy Andres Alvarez
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
 *   Item:
 *     properties:
 *       company:
 *         type: string
 *       name:
 *         type: string
 *       urls:
 *         properties:
 *           small:
 *             type: string
 *           large:
 *             type: string
 *         required:
 *           - small
 *           - large
 *     required:
 *       - company
 *       - name
 */
const ItemSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  urls: {
    small: {
      type: String,
      required: true,
      validate: isURL,
    },
    large: {
      type: String,
      required: true,
      validate: isURL,
    },
  },
}, {
  timestamps: true,
});

ItemSchema.plugin(mongoosePaginate);
ItemSchema.plugin(idValidator);
ItemSchema.plugin(fieldRemover);

export default mongoose.model('Item', ItemSchema);
