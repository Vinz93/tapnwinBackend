/**
 * @author Andres Alvarez
 * @description StringQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import StringQuestion from '../../models/vdlg/string_question';

const StringQuestionController = {
/**
 * @swagger
 * /string_questions:
 *   post:
 *     tags:
 *       - StringQuestions
 *     description: Creates a stringQuestions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: stringQuestion
 *         description: stringQuestion object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/StringQuestion'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/StringQuestion'
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
    StringQuestion.create(req.body)
    .then(stringQuestion => res.status(201).json(stringQuestion))
    .catch(next);
  },
};

export default StringQuestionController;
