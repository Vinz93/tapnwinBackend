/**
 * @author Juan Sanchez
 * @description Design controller definition
 * @lastModifiedBy Carlos Avilan
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Design from '../../models/dyg/design';

const DesignController = {
/**
 * @swagger
 * /designs:
 *   get:
 *     tags:
 *       - Designs
 *     description: Returns all items
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: exclusive
 *         description: True for player's designs and false otherwise
 *         in: query
 *         required: false
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
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const sort = req.query.sort || { views: 1 };
    let find;

    if (req.query.exclusive === 'true') {
      const player = { $ne: res.locals.user._id };
      find = Object.assign(req.query.find || {}, { player });
    } else {
      find = req.query.find || {};
    }

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
 * /players/me/designs:
 *   get:
 *     tags:
 *       - Designs
 *     description: Returns all designs related with player
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
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
    let player = res.locals.user._id;
    let populate = '';
    let sort;

    if (req.query.exclusive) {
      player = { $ne: res.locals.user._id };
      populate = 'player';
    }

    const limit = paginate.limit(req.query.limit);

    const find = Object.assign(req.query.find || {}, { player });
    const offset = paginate.offset(req.query.offset);

    if (req.query.random) {
      Design.syncRandom(() => '');
      sort = req.query.sort || { random: 1 };
    } else {
      sort = req.query.sort || { createdAt: 1 };
    }
    Design.paginate(find, {
      sort,
      offset,
      limit,
      populate: [populate],
    })
    .then(designs => res.json(designs))
    .catch(next);
  },

/**
 * @swagger
 * /players/me/designs:
 *   post:
 *     tags:
 *       - Designs
 *     description: Creates a player's design
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
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
    req.body.player = res.locals.user._id;

    Design.create(req.body)
    .then(design => res.status(201).json(design))
    .catch(next);
  },

/**
 * @swagger
 * /designs/{design_id}:
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
    .populate('player')
    .then(design => {
      if (!design)
        return Promise.reject(new APIError('Design not found', httpStatus.NOT_FOUND));

      res.json(design);
    })
    .catch(next);
  },

/**
 * @swagger
 * /designs/{design_id}:
 *   patch:
 *     tags:
 *       - Designs
 *     description: Add one more 'seen' person to a design
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: design_id
 *         description: Design's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: design
 *         description: A new person saw that design
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             views:
 *               type: number
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    Design.findById(req.params.design_id)
    .then(design => {
      if (!design)
        return Promise.reject(new APIError('Design not found', httpStatus.NOT_FOUND));

      if (req.body.views !== 1)
        return Promise.reject(new APIError('Value too high!', httpStatus.CONFLICT));

      req.body.views = design.views + 1;
      design.set(req.body);
      return design.save();
    })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },
};

export default DesignController;
