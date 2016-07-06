/**
 * @author Juan Sanchez
 * @description Category model definition
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

const CategorySchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    enum: {
      values: 'top mid bot'.split(' '),
      message: '`{VALUE}` is not a valid zone',
    },
  },
  urls: {
    selected: {
      type: String,
      required: true,
      validate: isURL,
    },
    unselected: {
      type: String,
      required: true,
      validate: isURL,
    },
  },
}, {
  timestamps: true,
});

CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(idValidator);
CategorySchema.plugin(fieldRemover);

export default mongoose.model('Category', CategorySchema);