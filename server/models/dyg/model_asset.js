/**
 * @author Juan Sanchez
 * @description Model model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';

import Asset from '../common/asset';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   ModelAsset:
 *     $ref: '#/definitions/Asset'
 */
const ModelAssetSchema = new Schema({});

export default Asset.discriminator('ModelAsset', ModelAssetSchema);
