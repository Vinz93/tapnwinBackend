/**
 * @author Andres Alvarez
 * @description Asset model definition
 * @lastModifiedBy Andres Alvarez
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

import config from '../../../config/env';

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

AssetSchema.pre('save', function (next) {
  this.wasUrlModified = this.isModified('url');

  next();
});

AssetSchema.post('save', function () {
  if (this.wasUrlModified)
    console.log('modified');
});


AssetSchema.post('findOneAndRemove', (asset) => {
  console.log(path.dirname(asset.url));
});


AssetSchema.plugin(paginate);
AssetSchema.plugin(idValidator);
AssetSchema.plugin(fieldRemover);

export default mongoose.model('Asset', AssetSchema);
