/**
 * @author Juan Sanchez
 * @description Model model definition
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

const ModelSchema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  name: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    required: true,
    validate: isURL,
  },
}, {
  timestamps: true,
});

ModelSchema.plugin(mongoosePaginate);
ModelSchema.plugin(idValidator);
ModelSchema.plugin(fieldRemover);

export default mongoose.model('Model', ModelSchema);
