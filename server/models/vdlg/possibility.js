/**
 * @author Juan Sanchez
 * @description Possibility model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';

import Asset from '../common/asset';

const Schema = mongoose.Schema;

const PossibilitySchema = new Schema({});

export default Asset.discriminator('Possibility', PossibilitySchema);
