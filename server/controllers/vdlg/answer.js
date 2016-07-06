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
  read(req, res, next) {
    Answer.findById(req.params.answer_id)
    .then(answer => {
      if (!answer)
        return res.status(404).end();

      res.json(answer);
    })
    .catch(next);
  },

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

  createByMe(req, res, next) {
    const data = Object.assign(req.body, {
      player: res.locals.user._id,
    });

    Answer.create(data)
    .then(answer => res.status(201).json(answer))
    .catch(next);
  },

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
