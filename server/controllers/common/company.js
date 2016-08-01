/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Company from '../../models/common/company';

const CompanyController = {
/**
 * @swagger
 * /companies:
 *   get:
 *     tags:
 *       - Companies
 *     description: Returns all companies
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
 *         description: An array of companies
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Company'
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

    Company.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(companies => res.json(companies))
    .catch(next);
  },

/**
 * @swagger
 * /companies:
 *   post:
 *     tags:
 *       - Companies
 *     description: Creates a company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company
 *         description: Company object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Company'
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
    Company.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(next);
  },

/**
 * @swagger
 * /companies/{company_id}:
 *   get:
 *     tags:
 *       - Companies
 *     description: Returns a company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company_id
 *         description: Company's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A company
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Company'
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
    Company.findById(req.params.company_id)
    .then(company => {
      if (!company)
        return res.status(404).end();

      res.json(company);
    })
    .catch(next);
  },

/**
 * @swagger
 * /companies/{company_id}:
 *   patch:
 *     tags:
 *       - Companies
 *     description: Updates a company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company_id
 *         description: Company's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: company
 *         description: Company object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    Company.findByIdAndUpdate(req.params.company_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(company => {
      if (!company)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /companies/{company_id}:
 *   delete:
 *     tags:
 *       - Companies
 *     description: Deletes a company
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company_id
 *         description: Company's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Company.findByIdAndRemove(req.params.company_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default CompanyController;
