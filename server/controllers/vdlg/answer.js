/**
 * @author Andres Alvarez
 * @description Answer controller definition
 * @lastModifiedBy Carlos Avilan
 */
import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Answer from '../../models/vdlg/answer';
import Question from '../../models/vdlg/question';

const AnswerController = {
/**
 * @swagger
 * /answers:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns all answers
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
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

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
 * /players/me/answers:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns all my answers
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
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
    const limit = paginate.limit(req.query.limit);
    const offset = paginate.offset(req.query.offset);

    req.query.find = req.query.find || {};

    const campaign = req.query.find.campaign;
    let find = {};

    if (campaign) {
      find.campaign = campaign;
      delete req.query.find.campaign;
    }

    Question.find(find)
    .then(questions => {
      const sort = req.query.sort || { createdAt: 1 };

      find = Object.assign(req.query.find || {}, {
        player: res.locals.user._id,
        question: { $in: questions.map(question => question._id) },
      });

      return Answer.paginate(find, {
        offset,
        limit,
        sort,
        populate: [{
          path: 'question',
          model: 'Question',
          populate: {
            path: 'possibilityAssets',
            model: 'PossibilityAsset',
          },
        }],
      });
    })
    .then(answers => {
      res.json(answers);
    })
    .catch(next);
  },

/**
 * @swagger
 * /answers/{answer_id}:
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
        return Promise.reject(new APIError('Answer not found', httpStatus.NOT_FOUND));

      res.json(answer);
    })
    .catch(next);
  },

/**
 * @swagger
 * /players/me/answers/statistics:
 *   get:
 *     tags:
 *       - Answers
 *     description: Returns the statistics of my answers
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
    const find = {};

    if (campaign) {
      find.campaign = campaign;
      delete req.query.find.campaign;
    }

    Question.find(find)
    .then(questions => {
      Object.assign(req.query.find || {}, {
        player: res.locals.user._id,
        question: { $in: questions.map(question => question._id) },
      });

      return Answer.find(Object.assign({ seen: true }, req.query.find))
      .populate('question');
    })
    .then(answers => [
      answers,
      Promise.map(answers, answer => {
        const question = answer.question;
        let length;

        if (question.__t === 'StringQuestion')
          length = question.possibilityStrings.length;
        else
          length = question.possibilityAssets.length;

        const possibilities = Array.from({ length }, (v, k) => k);

        return Promise.map(possibilities, posibility => Answer.count({
          question: question._id,
          personal: posibility,
        }))
        .then(data => {
          const max = Math.max(...data);
          return data.map((item, index) => {
            if (item === max)
              return index;
            return -1;
          })
          .filter(item => item !== -1);
        });
      }),
    ])
    .spread((answers, data) => {
      const correct = answers.filter((answer, i) => data[i].indexOf(answer.popular) !== -1).length;
      const total = answers.length;

      res.send({
        correct,
        percent: correct / total * 100,
        total,
      });
    })
    .catch(next);
  },

/**
 * @swagger
 * /players/me/answers:
 *   post:
 *     tags:
 *       - Answers
 *     description: Creates an answer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
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
 *       201:
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
    req.body.player = res.locals.user._id;

    Answer.create(req.body)
    .then(answer => res.status(httpStatus.CREATED).json(answer))
    .catch(next);
  },

/**
 * @swagger
 * /players/me/answers/{answer_id}:
 *   patch:
 *     tags:
 *       - Answers
 *     description: Creates an answer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
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
    Answer.findOne({
      _id: req.params.answer_id,
      player: res.locals.user._id,
    })
    .populate('question')
    .then(answer => {
      if (!answer)
        return Promise.reject(new APIError('Answer not found', httpStatus.NOT_FOUND));

      answer.set(req.body);

      return answer.save();
    })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },
};

export default AnswerController;
