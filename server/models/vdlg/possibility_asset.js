/**
 * @author Juan Sanchez
 * @description Possibility model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';

import Asset from '../common/asset';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   PossibilityAsset:
 *     $ref: '#/definitions/Asset'
 */
const PossibilityAssetSchema = new Schema({});

export default Asset.discriminator('PossibilityAsset', PossibilityAssetSchema);
