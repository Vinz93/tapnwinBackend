/**
 * @author Andres Alvarez
 * @description Mission-PlayerStatus model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   MissionStatus:
 *     properties:
 *       player:
 *         type: string
 *       missionCampaign:
 *         type: string
 *       value:
 *         type: integer
 *       isDone:
 *         type: boolean
 *     required:
 *       - player
 *       - missionCampaign
 */
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
  isDone: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

MissionStatusSchema.index({
  player: 1,
  missionCampaign: 1,
}, {
  unique: true,
});

MissionStatusSchema.plugin(paginate);
MissionStatusSchema.plugin(idValidator);
MissionStatusSchema.plugin(fieldRemover);

const MissionStatus = mongoose.model('MissionStatus', MissionStatusSchema);

export default MissionStatus;
