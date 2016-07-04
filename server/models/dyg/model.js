/**
 * @author Juan Sanchez
 * @description Model model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';

import Asset from '../common/asset';

const Schema = mongoose.Schema;

const ModelSchema = new Schema({});

export default Asset.discriminator('Model', ModelSchema);
