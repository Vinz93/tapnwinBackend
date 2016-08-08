/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import User from './user';

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
 *           age:
 *             type: integer
 *         required:
 *           - firstName
 *           - lastName
 *           - gender
 *           - age
 */
const PlayerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: {
      values: 'male female'.split(' '),
      message: '`{VALUE}` is not a valid gender',
    },
  },
  age: {
    type: Number,
    min: [0, '`{VALUE}` is not a valid age'],
  },
  balance: {
    type: Number,
    default: 0,
  },
});

export default User.discriminator('Player', PlayerSchema);
