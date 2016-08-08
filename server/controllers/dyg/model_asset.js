/**
 * @author Juan Sanchez
 * @description ModelAsset controller definition
 * @lastModifiedBy Andres Alvarez
 */

import httpStatus from 'http-status';

import ModelAsset from '../../models/dyg/model_asset';

const ModelAssetController = {
/**
 * @swagger
 * /model_assets:
 *   post:
 *     tags:
 *       - ModelAssets
 *     description: Creates a modelAsset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: modelAsset
 *         description: ModelAsset object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ModelAsset'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/ModelAsset'
 *              - properties:
 *                  id:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                  updatedAt:
 *                    type: string
 *                    format: date-time
 */
  create(req, res, next) {
    ModelAsset.create(req.body)
    .then(modelAsset => res.status(httpStatus.CREATED).json(modelAsset))
    .catch(next);
  },
};

export default ModelAssetController;
