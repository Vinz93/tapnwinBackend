/**
 * @author Juan Sanchez
 * @description Model model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign',
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

ModelSchema.methods = {};

ModelSchema.statics = {};

ModelSchema.plugin(mongoosePaginate);
ModelSchema.plugin(idValidator);
ModelSchema.plugin(fieldRemover);

export default mongoose.model('Model', ModelSchema);
