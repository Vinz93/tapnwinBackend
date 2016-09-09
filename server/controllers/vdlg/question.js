/**
 * @author Andres Alvarez
 * @description Question controller definition
 * @lastModifiedBy Andres Alvarez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Question from '../../models/vdlg/question';
import Answer from '../../models/vdlg/answer';

const QuestionController = {
/**
 * @swagger
 * /questions:
 *   get:
 *     tags:
 *       - Questions
 *     description: Returns all questions
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
 *         description: An array of questions
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Question'
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

    const find = Object.assign({}, req.query.find, {
      startAt: {
        $lte: new Date(),
      },
      finishAt: {
        $gte: new Date(),
      },
    });
    const sort = req.query.sort || { startAt: 1 };

    Question.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['possibilityAssets'],
    })
    .then(questions => res.json(questions))
    .catch(next);
  },

/**
 * @swagger
 * /players/me/questions:
 *   get:
 *     tags:
 *       - Questions
 *     description: Returns all my questions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An array of questions
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Question'
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
  readAllByMe(req, res, next) {
    const limit = paginate.limit(req.query.limit);
    const offset = paginate.offset(req.query.offset);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Question.find(find)
    .sort(sort)
    .populate('possibilityAssets')
    .then(questions => Promise.filter(questions, question => Answer.findOne({
      player: res.locals.user,
      question: question._id,
    }).then(answer => !answer)))
    .then(data => res.send({
      docs: data.slice(offset, limit),
      total: data.length,
      limit,
      offset,
    }))
    .catch(next);
  },

/**
 * @swagger
 * /questions/{question_id}:
 *   get:
 *     tags:
 *       - Questions
 *     description: Returns an question
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: question_id
 *         description: Question's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A question
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Question'
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
    Question.findById(req.params.question_id)
    .then(question => {
      if (!question)
        return Promise.reject(new APIError('Question not found', httpStatus.NOT_FOUND));

      res.json(question);
    })
    .catch(next);
  },

/**
 * @swagger
 * /questions/{question_id}/statistics:
 *   get:
 *     tags:
 *       - Questions
 *     description: Returns the statistics of a question
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: question_id
 *         description: Question's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A question
 *         schema:
 *           properties:
 *             counts:
 *               type: array
 *               items:
 *                 type: number
 *             percents:
 *               type: string
 *             total:
 *               type: string
 */
  readStatistic(req, res, next) {
    Question.findById(req.params.question_id)
    .then(question => {
      let length;

      if (question.__t === 'StringQuestion')
        length = question.possibilityStrings.length;
      else
        length = question.possibilityAssets.length;

      const possibilities = Array.from({ length }, (v, k) => k);

      return Promise.map(possibilities, possibility => Answer.count({
        question: req.params.question_id,
        personal: possibility,
      }));
    })
    .then(data => {
      const total = data.reduce((total, value) => total + value, 0);

      res.send({
        counts: data,
        percents: data.map(value => value / total * 100),
        total,
      });
    })
    .catch(next);
  },

  /**
   * @swagger
   * /questions/{question_id}:
   *   patch:
   *     tags:
   *       - Questions
   *     description: Updates a question
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: question_id
   *         description: Question's id
   *         in: path
   *         required: true
   *         type: string
   *       - name: campaign
   *         description: Question object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Question'
   *     responses:
   *       201:
   *         description: Successfully updated
   */
  update(req, res, next) {
    Question.findById(req.params.question_id)
      .populate('campaign')
      .then(question => {
        if (!question)
          return Promise.reject(new APIError('Question not found', httpStatus.NOT_FOUND));

        if (question.campaign.isActive())
          return Promise.reject(new APIError('Active campaign', httpStatus.BAD_REQUEST));

        question.set(req.body);

        return question.save();
      })
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },

  /**
   * @swagger
   * /questions/{question_id}:
   *   delete:
   *     tags:
   *       - Questions
   *     description: Deletes a question
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: question_id
   *         description: Question's id
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       204:
   *         description: Successfully deleted
   */
  delete(req, res, next) {
    Question.findById(req.params.campaign_id)
      .then(question => {
        if (!question)
          return Promise.reject(new APIError('Question not found', httpStatus.NOT_FOUND));

        return question.remove();
      })
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(next);
  },
};

export default QuestionController;
