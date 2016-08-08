/**
 * @author Juan Sanchez
 * @description Mission-Campaign model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

import MissionStatus from './mission_status';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   MissionCampaign:
 *     properties:
 *       mission:
 *         type: string
 *       campaign:
 *         type: string
 *       isRequired:
 *         type: string
 *       isBlocking:
 *         type: string
 *       blockedTime:
 *         type: number
 *       balance:
 *         type: number
 *       max:
 *         type: integer
 *     required:
 *       - mission
 *       - campaign
 */
const MissionCampaignSchema = new Schema({
  mission: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Mission',
  },
  campaign: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign',
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isBlocking: {
    type: Boolean,
    default: false,
  },
  blockTime: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0.0,
  },
  max: {
    type: Number,
    min: [1, '`{VALUE}` is not a valid max'],
    default: 1,
  },
}, {
  timestamps: true,
});

MissionCampaignSchema.pre('remove', function (next) {
  MissionStatus.remove({ missionCampaign: this.id })
  .then(next)
  .catch(next);
});

MissionCampaignSchema.plugin(paginate);
MissionCampaignSchema.plugin(idValidator);
MissionCampaignSchema.plugin(fieldRemover);

export default mongoose.model('MissionCampaign', MissionCampaignSchema);
