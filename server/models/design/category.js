/**
 * @author Juan Sanchez
 * @description Category model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';

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

CategorySchema.methods = {};

CategorySchema.statics = {};

mongoose.model('Category', CategorySchema);
