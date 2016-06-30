/**
 * @author Andres Alvarez
 * @description Question model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  personal: {
    type: String,
    required: true,
  },
  popular: {
    type: String,
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  finishAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

QuestionSchema.plugin(mongoosePaginate);
QuestionSchema.plugin(idValidator);
QuestionSchema.plugin(fieldRemover);

export default mongoose.model('Question', QuestionSchema);
