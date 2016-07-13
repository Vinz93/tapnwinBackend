/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Administrator from '../../models/common/administrator';

const AdminController = {
/**
 * @swagger
 * /api/v1/administrators:
 *   post:
 *     tags:
 *       - Administrators
 *     description: Creates an administrator
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: administrator
 *         description: Administrator object
 *         in: body
 *         required: true
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Administrator'
 *              - properties:
 *                  password:
 *                    type: string
 *                required:
 *                  - password
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Administrator'
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
    Administrator.create(req.body)
    .then(administrator => res.status(201).json(administrator))
    .catch(next);
  },

  update(req, res, next) {
    Administrator.findByIdAndUpdate(req.params.administrator_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default AdminController;
