/**
 * @author Juan Sanchez
 * @description Item controller definition
 * @lastModifiedBy Juan Sanchez
 */

import fs from 'fs';
import path from 'path';

import Item from '../../models/dyg/item';

const ItemController = {
/**
 * @swagger
 * /api/v1/items:
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
    const config = req.app.locals.config;

    const offset = config.paginate.offset(req.query.offset);
    const limit = config.paginate.limit(req.query.limit);

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
 * /api/v1/items:
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
    .then(item => res.status(201).json(item))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/items/{item_id}:
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
        return res.status(404).end();

      res.json(item);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/items/{item_id}:
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
    Item.findByIdAndUpdate(req.params.item_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(item => {
      if (!item)
        return res.status(404).end();

      const config = req.app.locals.config;

      fs.unlinkSync(path.join(config.root, `/uploads${item.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/items/{item_id}:
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
        return res.status(404).end();

      const config = req.app.locals.config;

      fs.unlinkSync(path.join(config.root, `/uploads${item.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },
};

export default ItemController;
