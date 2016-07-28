/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Design from '../../models/dyg/design';

const DesignController = {
/**
 * @swagger
 * /api/v1/designs:
 *   get:
 *     tags:
 *       - Designs
 *     description: Returns all items
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
 *         description: An array of designs
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Design'
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
    const config = req.app.locals.config;

    const offset = config.paginate.offset(req.query.offset);
    const limit = config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Design.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['player'],
    })
    .then(designs => res.json(designs))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/players/me/designs:
 *   get:
 *     tags:
 *       - Designs
 *     description: Returns all designs related with player
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
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
 *       - name: exclusive
 *         description: True for player's designs and false otherwise
 *         in: query
 *         required: false
 *         type: string
 *       - name: random
 *         description: True for random designs and false otherwise
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: An array of designs
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Design'
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
  readAllByMe(req, res, next) {
    const config = req.app.locals.config;

    const limit = config.paginate.limit(req.query.limit);
    const player = (req.query.exclusive === undefined ||
      req.query.exclusive === 'false') ? res.locals.user._id : {
        $ne: res.locals.user._id,
      };

    const find = Object.assign(req.query.find || {}, {
      player,
    });
    const sort = req.query.sort || { createdAt: 1 };

    if (req.query.random === 'true') {
      Design.findRandom(find).limit(limit).sort(sort)
      .then(designs => res.json(designs))
      .catch(next);
    } else {
      const offset = config.paginate.offset(req.query.offset);

      Design.paginate(find, {
        sort,
        offset,
        limit,
      })
      .then(designs => res.json(designs))
      .catch(next);
    }
  },

/**
 * @swagger
 * /api/v1/players/me/designs:
 *   post:
 *     tags:
 *       - Designs
 *     description: Creates a player's design
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: design
 *         description: Design object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Design'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Design'
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
  createByMe(req, res, next) {
    const data = Object.assign(req.body, {
      player: res.locals.user._id,
    });

    Design.create(data)
    .then(design => res.status(201).json(design))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/designs/{design_id}:
 *   get:
 *     tags:
 *       - Designs
 *     description: Returns a design
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: design_id
 *         description: Design's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A design
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Design'
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
    Design.findById(req.params.design_id)
    .then(design => {
      if (!design)
        return res.status(404).end();

      res.json(design);
    })
    .catch(next);
  },
};

export default DesignController;
