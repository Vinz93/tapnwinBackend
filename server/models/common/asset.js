/**
 * @author Andres Alvarez
 * @description Asset model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
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
 *   Asset:
 *     properties:
 *       company:
 *         type: string
 *       name:
 *         type: string
 *       url:
 *         type: string
 *     required:
 *       - company
 *       - name
 *       - url
 */
const AssetSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: isURL,
  },
}, {
  timestamps: true,
});

AssetSchema.plugin(paginate);
AssetSchema.plugin(idValidator);
AssetSchema.plugin(fieldRemover);

export default mongoose.model('Asset', AssetSchema);
