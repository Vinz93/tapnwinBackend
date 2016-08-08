/**
 * @author Juan Sanchez
 * @description Item controller definition
 * @lastModifiedBy Juan Sanchez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate, unlinkSync } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Item from '../../models/dyg/item';

const ItemController = {
/**
 * @swagger
 * /items:
 *   get:
 *     tags:
 *       - Items
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
 *         description: An array of items
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Item'
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

    Item.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['company'],
    })
    .then(items => res.json(items))
    .catch(next);
  },

/**
 * @swagger
 * /items:
 *   post:
 *     tags:
 *       - Items
 *     description: Creates an item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: item
 *         description: Item object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Item'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Item'
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
    Item.create(req.body)
    .then(item => res.status(httpStatus.CREATED).json(item))
    .catch(next);
  },

/**
 * @swagger
 * /items/{item_id}:
 *   get:
 *     tags:
 *       - Items
 *     description: Returns an item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: item_id
 *         description: Item's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An item
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Item'
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
    Item.findById(req.params.item_id)
    .then(item => {
      if (!item)
        return Promise.reject(new APIError('Item not found', httpStatus.NOT_FOUND));

      res.json(item);
    })
    .catch(next);
  },

/**
 * @swagger
 * /items/{item_id}:
 *   patch:
 *     tags:
 *       - Items
 *     description: Updates an item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: item_id
 *         description: Item's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: item
 *         description: Item object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Item'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    let urls;

    Item.findById(req.params.item_id)
    .then(item => {
      if (!item)
        return Promise.reject(new APIError('Item not found', httpStatus.NOT_FOUND));

      urls = item.toJSON().urls;

      item.set(req.body);

      return item.save();
    })
    .then((item) => {
      const config = req.app.locals.config;

      if (urls.animation !== item.urls.small)
        unlinkSync(config, urls.small);

      if (urls.enable !== item.urls.large)
        unlinkSync(config, urls.large);

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /items/{item_id}:
 *   delete:
 *     tags:
 *       - Items
 *     description: Deletes an item
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: item_id
 *         description: Item's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Item.findByIdAndRemove(req.params.item_id)
    .then(item => {
      if (!item)
        return Promise.reject(new APIError('Item not found', httpStatus.NOT_FOUND));

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },
};

export default ItemController;
