/**
 * @author Andres Alvarez
 * @description GameAsset controller definition
 * @lastModifiedBy Andres Alvarez
 */

import GameAsset from '../../models/common/game_asset';

const GameAssetController = {
/**
 * @swagger
 * /game_assets:
 *   post:
 *     tags:
 *       - GameAssets
 *     description: Creates a gameAssets
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: gameAsset
 *         description: GameAsset object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/GameAsset'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/GameAsset'
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
    GameAsset.create(req.body)
    .then(gameAsset => res.status(201).json(gameAsset))
    .catch(next);
  },
};

export default GameAssetController;
