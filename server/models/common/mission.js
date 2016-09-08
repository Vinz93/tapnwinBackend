/**
 * @author Andres Alvarez
 * @description Mission controller definition
 * @lastModifiedBy Carlos Avilan
 */

import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';
import idValidator from 'mongoose-id-validator';
import fieldRemover from 'mongoose-field-remover';

import { removeIterative } from '../../helpers/utils';
import MissionCampaign from './mission_campaign';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Mission:
 *     properties:
 *       code:
 *         type: string
 *       description:
 *         type: string
 *     required:
 *       - code
 *       - description
 */
const MissionSchema = new Schema({
  code: {
    type: String,
    // unique: true,/
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

MissionSchema.post('remove', function (next) {
  MissionCampaign.find({ mission: this.id })
  .then(missionCampaign => removeIterative(missionCampaign))
  .catch(next);
});

MissionSchema.plugin(paginate);
MissionSchema.plugin(idValidator);
MissionSchema.plugin(fieldRemover);

export default mongoose.model('Mission', MissionSchema);
