/**
 * @author Andres Alvarez
 * @description Company model definition
 * @lastModifiedBy Juan Sanchez
 */

 /**
  * @swagger
  * definition:
  *   Administrator:
  *     allOf:
  *       - $ref: '#/definitions/User'
  */
import mongoose from 'mongoose';

import User from './user';

const Schema = mongoose.Schema;

const AdministratorSchema = new Schema({});

export default User.discriminator('Administrator', AdministratorSchema);
