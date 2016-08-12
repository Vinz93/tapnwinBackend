/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import httpStatus from 'http-status';

import Player from '../../models/common/player';

const PlayerController = {
/**
 * @swagger
 * /players:
 *   post:
 *     tags:
 *       - Players
 *     description: Creates a player
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: player
 *         description: Player object
 *         in: body
 *         required: true
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Player'
 *              - properties:
 *                  password:
 *                    type: string
 *                required:
 *                  - password
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Player'
 *              - properties:
 *                  id:
 *                    type: string
 *                  balance:
 *                    type: integer
 *                  age:
 *                    type: integer
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                  updatedAt:
 *                    type: string
 *                    format: date-time
 */
  create(req, res, next) {
    Player.create(req.body)
    .then(player => res.status(httpStatus.CREATED).json(player))
    .catch(next);
  },
};

export default PlayerController;
