/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import waterfall from 'async/waterfall';
import Promise from 'bluebird';

import Design from '../../models/dyg/design';
import Vote from '../../models/dyg/vote';

const VoteController = {
/**
 * @swagger
 * /api/v1/votes:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns all votes
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
 *         description: An array of votes
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Vote'
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
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Vote.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(votes => res.json(votes))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1//players/me/votes:
 *   post:
 *     tags:
 *       - Votes
 *     description: Creates a player's vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: vote
 *         description: Vote object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Vote'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Vote'
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

    Vote.create(data)
    .then(vote => res.status(201).json(vote))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/votes/{vote_id}:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns a vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: vote_id
 *         description: Vote's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A vote
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Vote'
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
    Vote.findById(req.params.vote_id)
    .then(vote => {
      if (!vote)
        return res.status(404).end();

      res.json(vote);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/players/me/designs/{design_id}/vote:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns a vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: design_id
 *         description: Design's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A vote
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Vote'
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
  readByMeDesign(req, res, next) {
    const criteria = {
      design: req.params.design_id,
      player: res.locals.user._id,
    };

    Vote.findOne(criteria)
    .then(vote => {
      if (!vote)
        return res.status(404).end();

      res.json(vote);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/designs/{design_id}/votes/statistics:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns design's statistics
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
 *         description: A vote
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               sticker:
 *                 type: string
 *               count:
 *                 type: integer
 */
  readStatisticByDesign(req, res, next) {
    waterfall([
      cb => {
        Design.findById(req.params.design_id)
        .populate('campaign')
        .then(design => cb(null, design))
        .catch(cb);
      },
      (design, cb) => {
        if (!design)
          return res.status(404).end();

        Promise.map(design.campaign.dyg.stickers, sticker => Vote.count({
          design: design._id,
          stickers: sticker,
        })
        .then(count => {
          const data = {
            sticker,
            count,
          };

          return data;
        }))
        .then(data => cb(null, data));
      },
    ], (err, data) => {
      if (err)
        next(err);

      res.send(data);
    });
  },

/**
 * @swagger
 * /api/v1/players/me/votes/{vote_id}:
 *   patch:
 *     tags:
 *       - Votes
 *     description: Updates a player's vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: vote_id
 *         description: Vote's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: vote
 *         description: Vote object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Vote'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  updateByMe(req, res, next) {
    const criteria = {
      _id: req.params.vote_id,
      player: res.locals.user._id,
    };

    Vote.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(vote => {
      if (!vote)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default VoteController;
