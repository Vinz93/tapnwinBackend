/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

const MissionStatusSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  mission: {
    type: Schema.Types.ObjectId,
    ref: 'Mission',
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

MissionStatusSchema.plugin(mongoosePaginate);
MissionStatusSchema.plugin(idValidator);
MissionStatusSchema.plugin(fieldRemover);

export default mongoose.model('Status', MissionStatusSchema);
