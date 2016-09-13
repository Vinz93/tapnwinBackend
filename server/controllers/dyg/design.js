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
import Vote from '../../models/dyg/vote';

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

    // const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Vote.aggregate([
      {
        $group: {
          _id: '$design',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: 1 } },
      { $limit: limit },
      { $skip: offset },
    ], (err, votes) => {
      const designsVoted = [];
      for (let i = 0; i < votes.length; i++) {
        designsVoted.push(votes[i]._id);
      }
      Design.paginate({ _id: { $nin: designsVoted } }, {
        sort,
        offset,
        limit,
        populate: ['player'],
      })
      .then(designsNotVoted => {
        if (designsNotVoted.total === designsNotVoted.limit) {
          res.json(designsNotVoted);
        }
        Design.paginate({ _id: { $in: designsVoted } }, {
          sort,
          offset,
          limit,
          populate: ['player'],
        })
        .then(designsIn => {
          const designs = {};
          const difference = designsNotVoted.limit - designsNotVoted.total;
          designs.docs = [].concat(designsNotVoted.docs, designsIn.docs.slice(0, difference));
          designs.total = designs.docs.length;
          designs.offset = offset;
          designs.limit = limit;
          res.json(designs);
        });
      })
      .catch(next);
    });
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
};

export default DesignController;
