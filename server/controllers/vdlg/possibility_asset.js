/**
 * @author Andres Alvarez
 * @description PossibilityAsset controller definition
 * @lastModifiedBy Juan Sanchez
 */

import PossibilityAsset from '../../models/vdlg/possibility_asset';

const PossibilityAssetController = {
/**
 * @swagger
 * /api/v1/possibility_assets:
 *   post:
 *     tags:
 *       - PossibilityAssets
 *     description: Creates a possibilityAssets
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: possibilityAsset
 *         description: PossibilityAsset object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/PossibilityAsset'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/PossibilityAsset'
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
    PossibilityAsset.create(req.body)
    .then(possibilityAsset => res.status(201).json(possibilityAsset))
    .catch(next);
  },
};

export default PossibilityAssetController;
