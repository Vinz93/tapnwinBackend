/**
 * @author Andres Alvarez
 * @description Answer controller definition
 * @lastModifiedBy Andres Alvarez
 */

import waterfall from 'async/waterfall';
import Promise from 'bluebird';

import Answer from '../../models/vdlg/answer';
import Question from '../../models/vdlg/question';

const AnswerController = {
/**
 * @swagger
 * /api/v1/answers:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns all answers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of answers
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Answer'
 *                   - properties:
 *                       id:
 *                         type: string
 *                       seen:
 *                         type: boolean
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

    Answer.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(answers => res.json(answers))
    .catch(next);
  },
/**
 * @swagger
 * /api/v1/players/me/answers:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns all my answers
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
 *         description: An array of answers
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Answer'
 *                   - properties:
 *                       id:
 *                         type: string
 *                       seen:
 *                         type: boolean
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

    req.query.find = req.query.find || {};

    const campaign = req.query.find.campaign;
    let find = {};

    if (campaign) {
      find.campaign = campaign;
      delete req.query.find.campaign;
    }

    waterfall([
      cb => {
        Question.find(find)
        .then(questions => cb(null, questions))
        .catch(cb);
      },
      (questions, cb) => {
        const sort = req.query.sort || { createdAt: 1 };

        find = Object.assign(req.query.find || {}, {
          player: res.locals.user._id,
          question: { $in: questions.map(question => question._id) },
        });

        Answer.paginate(find, {
          offset,
          limit,
          sort,
          populate: ['question'],
        })
        .then(answers => cb(null, answers))
        .catch(cb);
      },
    ], (err, answers) => {
      if (err)
        next(err);

      res.json(answers);
    });
  },

/**
 * @swagger
 * /api/v1/answers/{answer_id}:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns an answer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: answer_id
 *         description: Answer's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A answer
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Answer'
 *              - properties:
 *                  id:
 *                    type: string
 *                  seen:
 *                    type: boolean
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                  updatedAt:
 *                    type: string
 *                    format: date-time
 */
  read(req, res, next) {
    Answer.findById(req.params.answer_id)
    .then(answer => {
      if (!answer)
        return res.status(404).end();

      res.json(answer);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/players/me/answers/statistics:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns the statistics of my answers
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
 *         description: A statistic
 *         schema:
 *           properties:
 *             correct:
 *               type: integer
 *             percent:
 *               type: number
 *               format: float
 *             total:
 *               type: integer
 */
  readStatisticByMe(req, res, next) {
    req.query.find = req.query.find || {};

    const campaign = req.query.find.campaign;
    let find = {};

    if (campaign) {
      find.campaign = campaign;
      delete req.query.find.campaign;
    }

    waterfall([
      cb => {
        Question.find(find)
        .then(questions => cb(null, questions))
        .catch(cb);
      },
      (questions, cb) => {
        find = Object.assign(req.query.find || {}, {
          player: res.locals.user._id,
          question: { $in: questions.map(question => question._id) },
        });

        Answer.find(find)
        .populate('question')
        .then(answers => cb(null, answers))
        .catch(cb);
      },
      (answers, cb) => {
        Promise.map(answers, answer => {
          const question = answer.question;
          const possibilities = Array.from({
            length: answer.question.possibilities.length,
          }, (v, k) => k);

          return Promise.map(possibilities, posibility => Answer.count({
            question: question._id,
            personal: posibility,
          }))
          .then(data => data.indexOf(Math.max(...data)))
          .catch(cb);
        })
        .then(data => cb(null, answers, data))
        .catch(cb);
      },
    ], (err, answers, data) => {
      if (err)
        next(err);

      const correct = answers.filter((answer, i) => answer.popular === data[i]).length;
      const total = answers.length;

      res.send({
        correct,
        percent: correct / total * 100,
        total,
      });
    });
  },

/**
 * @swagger
 * /api/v1/players/me/answers:
 *   post:
 *     tags:
 *       - Answers
 *     description: Creates an answer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: answer
 *         description: Answer object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Answer'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *             - $ref: '#/definitions/Answer'
 *             - properties:
 *                 id:
 *                   type: string
 *                 seen:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
  createByMe(req, res, next) {
    const data = Object.assign(req.body, {
      player: res.locals.user._id,
    });

    Answer.create(data)
    .then(answer => res.status(201).json(answer))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/players/me/answers/{answer_id}:
 *   patch:
 *     tags:
 *       - Answers
 *     description: Creates an answer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: answer_id
 *         description: Answer's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: answer
 *         description: Answer object
 *         in: body
 *         required: true
 *         schema:
 *           properties:
 *             seen:
 *               type: boolean
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  updateByMe(req, res, next) {
    const criteria = {
      _id: req.params.answer_id,
      player: res.locals.user._id,
    };

    Answer.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(answer => {
      if (!answer)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default AnswerController;
