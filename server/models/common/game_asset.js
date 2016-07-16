/**
 * @author Andres Alvarez
 * @description Model model definition
 * @lastModifiedBy Andres Alvarez
 */

import mongoose from 'mongoose';

import Asset from './asset';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   GameAsset:
 *     $ref: '#/definitions/Asset'
 */
const GameAssetSchema = new Schema({});

export default Asset.discriminator('GameAsset', GameAssetSchema);
