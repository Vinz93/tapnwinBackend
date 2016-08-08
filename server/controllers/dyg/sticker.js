/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate, unlinkSync } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Sticker from '../../models/dyg/sticker';

const StickerController = {
/**
 * @swagger
 * /stickers:
 *   get:
 *     tags:
 *       - Stickers
 *     description: Returns all stickers
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
 *         description: An array of stickers
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Sticker'
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

    Sticker.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['campaign'],
    })
    .then(stickers => res.json(stickers))
    .catch(next);
  },

/**
 * @swagger
 * /stickers:
 *   post:
 *     tags:
 *       - Stickers
 *     description: Creates a sticker
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sticker
 *         description: Sticker object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Sticker'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Sticker'
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
    Sticker.create(req.body)
    .then(sticker => res.status(httpStatus.CREATED).json(sticker))
    .catch(next);
  },

/**
 * @swagger
 * /stickers/{sticker_id}:
 *   get:
 *     tags:
 *       - Stickers
 *     description: Returns a sticker
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sticker_id
 *         description: Sticker's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A sticker
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Sticker'
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
    Sticker.findById(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return Promise.reject(new APIError('Sticker not found', httpStatus.NOT_FOUND));

      res.json(sticker);
    })
    .catch(next);
  },

/**
 * @swagger
 * /stickers/{sticker_id}:
 *   patch:
 *     tags:
 *       - Stickers
 *     description: Updates a sticker
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sticker_id
 *         description: Sticker's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: sticker
 *         description: Sticker object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Sticker'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    let urls;

    Sticker.findById(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return Promise.reject(new APIError('Sticker not found', httpStatus.NOT_FOUND));

      urls = sticker.toJSON().urls;

      sticker.set(req.body);

      return sticker.save();
    })
    .then((sticker) => {
      const config = req.app.locals.config;

      if (urls.animation !== sticker.urls.animation)
        unlinkSync(config, urls.animation);

      if (urls.enable !== sticker.urls.enable)
        unlinkSync(config, urls.enable);

      if (urls.disable !== sticker.urls.disable)
        unlinkSync(config, urls.disable);

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /stickers/{sticker_id}:
 *   delete:
 *     tags:
 *       - Stickers
 *     description: Deletes a sticker
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: sticker_id
 *         description: Sticker's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Sticker.findByIdAndRemove(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return Promise.reject(new APIError('Sticker not found', httpStatus.NOT_FOUND));

      const config = req.app.locals.config;

      unlinkSync(config, sticker.urls.animation);
      unlinkSync(config, sticker.urls.enable);
      unlinkSync(config, sticker.urls.disable);

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },
};

export default StickerController;
