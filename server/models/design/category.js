/**
 * @author Juan Sanchez
 * @description Category model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  url: {
    type: String,
    required: true,
    validate: validate({
      validator: 'isURL',
      message: 'not a valid url',
    }),
  },
});

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
  items: [ItemSchema],
});

CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(idValidator);
CategorySchema.plugin(fieldRemover);

CategorySchema.methods = {};

CategorySchema.statics = {};

export default mongoose.model('Category', CategorySchema);
