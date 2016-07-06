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

  read(req, res, next) {
    Question.findById(req.params.question_id)
    .then(question => {
      if (!question)
        return res.status(404).end();

      res.json(question);
    })
    .catch(next);
  },

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
