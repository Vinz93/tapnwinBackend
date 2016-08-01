/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import { paginate } from '../../helpers/utils';
import Mission from '../../models/common/mission';

const MissionController = {
/**
 * @swagger
 * /missions:
 *   get:
 *     tags:
 *       - Missions
 *     description: Returns all missions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: limit
 *         description: Return limit
 *         in: query
 *         required: false
 *         type: integer
 *       - name: offset
 *         description: Return offset
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of missions
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Mission'
 *                   - properties:
 *                       id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *             total:
 *               type: integer
 *             limit:
 *               type: integer
 *             offset:
 *               type: integer
 */
  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Mission.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(missions => res.json(missions))
    .catch(next);
  },

/**
 * @swagger
 * /missions:
 *   post:
 *     tags:
 *       - Missions
 *     description: Creates a mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission
 *         description: Mission object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Mission'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Mission'
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
    Mission.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(next);
  },

/**
 * @swagger
 * /missions/{mission_id}:
 *   get:
 *     tags:
 *       - Missions
 *     description: Returns a mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission_id
 *         description: Missions's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A mission
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Mission'
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
  read(req, res, next) {
    Mission.findById(req.params.mission_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.json(mission);
    })
    .catch(next);
  },

/**
 * @swagger
 * /missions/{mission_id}:
 *   patch:
 *     tags:
 *       - Missions
 *     description: Updates a mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission_id
 *         description: Mission's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: mission
 *         description: Mission object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Mission'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    Mission.findByIdAndUpdate(req.params.mission_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /missions/{mission_id}:
 *   delete:
 *     tags:
 *       - Missions
 *     description: Deletes a mission
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission_id
 *         description: Mission's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Mission.findByIdAndRemove(req.params.mission_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default MissionController;
