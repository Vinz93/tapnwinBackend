/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Player from '../../models/common/player';

const PlayerController = {
/**
 * @swagger
 * /api/v1/players:
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
 *                  balance:
 *                    type: integer
 */
  create(req, res, next) {
    Player.create(req.body)
    .then(player => res.status(201).json(player))
    .catch(next);
  },

  update(req, res, next) {
    Player.findByIdAndUpdate(req.params.player_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default PlayerController;
