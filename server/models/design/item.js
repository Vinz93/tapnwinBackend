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

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: validate({
      validator: 'isURL',
      message: 'not a valid url',
    }),
  },
}, {
  timestamps: true,
});

ItemSchema.plugin(mongoosePaginate);
ItemSchema.plugin(idValidator);
ItemSchema.plugin(fieldRemover);

export default mongoose.model('Item', ItemSchema);
