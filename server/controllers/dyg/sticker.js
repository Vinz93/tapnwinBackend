/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import fs from 'fs';
import path from 'path';

import Sticker from '../../models/dyg/sticker';

const StickerController = {
/**
 * @swagger
 * /api/v1/stickers:
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
    const config = req.app.locals.config;

    const offset = config.paginate.offset(req.query.offset);
    const limit = config.paginate.limit(req.query.limit);

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
 * /api/v1/stickers:
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
    .then(sticker => res.status(201).json(sticker))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/stickers/{sticker_id}:
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
        return res.status(404).end();

      res.json(sticker);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/stickers/{sticker_id}:
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
    Sticker.findByIdAndUpdate(req.params.sticker_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      const config = req.app.locals.config;

      fs.unlinkSync(path.join(config.root, `/uploads${sticker.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/stickers/{sticker_id}:
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
        return res.status(404).end();

      const config = req.app.locals.config;

      fs.unlinkSync(path.join(config.root, `/uploads${sticker.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },
};

export default StickerController;
