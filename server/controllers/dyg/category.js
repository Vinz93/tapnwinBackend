/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres ALvarez
 */
import assignment from 'assignment';

import { paginate, unlinkSync } from '../../helpers/utils';
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
    .then(category => res.status(201).json(category))
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
        return res.status(404).end();

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
    Category.findById(req.params.category_id)
    .then(category => {
      if (!category)
        return res.status(404).end();

      const bodyUrls = req.body.urls;

      if (bodyUrls) {
        const config = req.app.locals.config;
        const urls = category.urls;

        if (bodyUrls.selected && urls.selected !== bodyUrls.selected)
          unlinkSync(config, urls.selected);

        if (bodyUrls.unselected && urls.unselected !== bodyUrls.unselected)
          unlinkSync(config, urls.unselected);
      }

      assignment(category, req.body);

      return category.save();
    })
    .then(() => res.status(204).end())
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
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default CategoryController;
