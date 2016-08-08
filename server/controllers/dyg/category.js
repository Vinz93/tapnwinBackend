/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres ALvarez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate, unlinkSync } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Category from '../../models/dyg/category';

const CategoryController = {
/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categories
 *     description: Returns all categories
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
 *         description: An array of categories
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Category'
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

    Category.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['company'],
    })
    .then(categories => res.json(categories))
    .catch(next);
  },

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Categories
 *     description: Creates a category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category
 *         description: Category object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Category'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Category'
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
    Category.create(req.body)
    .then(category => res.status(httpStatus.CREATED).json(category))
    .catch(next);
  },

/**
 * @swagger
 * /category/{category_id}:
 *   get:
 *     tags:
 *       - Categories
 *     description: Returns a category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category_id
 *         description: Category's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A category
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Category'
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
    Category.findById(req.params.category_id)
    .populate('company')
    .then(category => {
      if (!category)
        return Promise.reject(new APIError('Category not found', httpStatus.NOT_FOUND));

      res.json(category);
    })
    .catch(next);
  },

/**
 * @swagger
 * /categories/{category_id}:
 *   patch:
 *     tags:
 *       - Categories
 *     description: Updates a category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category_id
 *         description: Category's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: category
 *         description: Category object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Category'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    let urls;

    Category.findById(req.params.category_id)
    .then(category => {
      if (!category)
        return Promise.reject(new APIError('Category not found', httpStatus.NOT_FOUND));

      urls = category.toJSON().urls;

      category.set(req.body);

      return category.save();
    })
    .then((category) => {
      const config = req.app.locals.config;

      if (urls.animation !== category.urls.selected)
        unlinkSync(config, urls.selected);

      if (urls.enable !== category.urls.unselected)
        unlinkSync(config, urls.unselected);

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /categories/{category_id}:
 *   delete:
 *     tags:
 *       - Categories
 *     description: Deletes a category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category_id
 *         description: Category's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Category.findByIdAndRemove(req.params.category_id)
    .then(category => {
      if (!category)
        return Promise.reject(new APIError('Category not found', httpStatus.NOT_FOUND));

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },
};

export default CategoryController;
