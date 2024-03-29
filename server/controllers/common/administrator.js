/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */
import httpStatus from 'http-status';

import Administrator from '../../models/common/administrator';

const AdminController = {
/**
 * @swagger
 * /administrators:
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
    .then(administrator => res.status(httpStatus.CREATED).json(administrator))
    .catch(next);
  },
};

export default AdminController;
