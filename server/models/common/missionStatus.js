/**
 * @author Andres Alvarez
 * @description Mission-PlayerStatus model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';
import findOrCreate from 'mongoose-findorcreate';

const Schema = mongoose.Schema;

const MissionStatusSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  missionCampaign: {
    type: Schema.Types.ObjectId,
    ref: 'MissionCampaign',
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

MissionStatusSchema.plugin(mongoosePaginate);
MissionStatusSchema.plugin(idValidator);
MissionStatusSchema.plugin(fieldRemover);
MissionStatusSchema.plugin(findOrCreate);

const MissionStatus = mongoose.model('Status', MissionStatusSchema);

export default MissionStatus;
