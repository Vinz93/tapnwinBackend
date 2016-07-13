/**
 * @author Andres Alvarez
 * @description Question controller definition
 * @lastModifiedBy Andres Alvarez
 */

import waterfall from 'async/waterfall';
import Promise from 'bluebird';

import Question from '../../models/vdlg/question';
import Answer from '../../models/vdlg/answer';

const QuestionController = {
/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     tags:
 *       - Questions
 *     description: Returns all questions
 *     produces:
 *       - application/json
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
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Question.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(questions => res.json(questions))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/players/me/questions:
 *   get:
 *     tags:
 *       - Questions
 *     description: Returns all my questions
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
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
    const locals = req.app.locals;

    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    waterfall([
      cb => {
        Question.find(find).sort(sort)
        .then(questions => cb(null, questions))
        .catch(cb);
      },
      (cb, questions) => {
        Promise.filter(questions, question => Answer.findOne({
          player: res.locals.user,
          question: question._id,
        }).then(answer => !answer))
        .then(data => cb(null, data));
      },
    ], (err, data) => {
      if (err)
        next(err);

      res.send({
        docs: data.slice(offset, limit),
        total: data.length,
        limit,
        offset,
      });
    });
  },

/**
 * @swagger
 * /api/v1/questions/{question_id}:
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
        return res.status(404).end();

      res.json(question);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/questions/{question_id}/statistics:
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
    waterfall([
      cb => {
        Question.findById(req.params.question_id)
        .then(question => cb(null, question))
        .catch(cb);
      },
      (question, cb) => {
        const possibilities = Array.from({ length: question.possibilities.length }, (v, k) => k);

        Promise.map(possibilities, possibility => Answer.count({
          question: req.params.question_id,
          personal: possibility,
        }))
        .then(data => cb(null, data))
        .catch(cb);
      },
    ], (err, data) => {
      if (err)
        next(err);

      const total = data.reduce((total, value) => total + value, 0);

      res.send({
        counts: data,
        percents: data.map(value => value / total * 100),
        total,
      });
    });
  },
};

export default QuestionController;
