/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Vincenzo Bianco
 */

import mongoose from 'mongoose';

import { removeIterative } from '../../helpers/utils';
import User from './user';
import CampaignStatus from './campaign_status';
import MissionStatus from './mission_status';
import Design from '../dyg/design';
import Answer from '../vdlg/answer';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   Player:
 *     allOf:
 *       - $ref: '#/definitions/User'
 *       - properties:
 *           firstName:
 *             type: string
 *           lastName:
 *             type: string
 *           gender:
 *             type: string
 *           bornAt:
 *             type: string
 *             format: date-time
 *         required:
 *           - firstName
 *           - lastName
 *           - gender
 *           - bornAt
 */
const PlayerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
    enum: {
      values: 'male female'.split(' '),
      message: '`{VALUE}` is not a valid gender',
    },
  },
  facebookId: {
    type: String,
  },
  twitterId: {
    type: String,
  },
  bornAt: {
    type: Date,
    default: new Date(),
  },
  balance: {
    type: Number,
    default: 1000,
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

PlayerSchema.virtual('age').get(function () {
  const today = new Date();
  const bornAt = this.bornAt;
  const m = today.getMonth() - bornAt.getMonth();
  let age = today.getFullYear() - bornAt.getFullYear();

  if (m < 0 || (m === 0 && today.getDate() < bornAt.getDate()))
    age--;

  return age;
});

PlayerSchema.post('remove', function (next) {
  const player = this.id;

  Promise.all([
    Design.find({ player }).then(designs => removeIterative(designs)),
    Answer.remove({ player }),
    CampaignStatus.remove({ player }),
    MissionStatus.remove({ player }),
  ])
  .then(next)
  .catch(next);
});

export default User.discriminator('Player', PlayerSchema);
