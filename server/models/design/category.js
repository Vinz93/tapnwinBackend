/**
 * @author Juan Sanchez
 * @description Category model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign',
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
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }],
}, {
  timestamps: true,
});

CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(idValidator);
CategorySchema.plugin(fieldRemover);

export default mongoose.model('Category', CategorySchema);
