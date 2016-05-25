/**
 * @author Juan Sanchez
 * @description Model model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import validate from 'mongoose-validator';

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

mongoose.model('Model', ModelSchema);
