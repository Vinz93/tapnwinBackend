/**
 * @author Andres Alvarez
 * @description AssetQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import AssetQuestion from '../../models/vdlg/asset_question';

const AssetQuestionController = {
  /**
   * @swagger
   * /api/v1/asset_questions:
   *   post:
   *     tags:
   *       - AssetQuestions
   *     description: Creates a assetQuestions
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: assetQuestion
   *         description: assetQuestion object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/AssetQuestion'
   *     responses:
   *       200:
   *         description: Successfully created
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/AssetQuestion'
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
    AssetQuestion.create(req.body)
    .then(assetQuestion => res.status(201).json(assetQuestion))
    .catch(next);
  },
};

export default AssetQuestionController;
