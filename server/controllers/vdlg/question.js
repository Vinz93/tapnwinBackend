/**
 * @author Andres Alvarez
 * @description Question controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Promise from 'bluebird';

import Question from '../../models/vdlg/question';
import Answer from '../../models/vdlg/answer';

const QuestionController = {
  read(req, res, next) {
    Question.findById(req.params.question_id)
    .then(question => {
      if (!question)
        return res.status(404).end();

      res.json(question);
    })
    .catch(next);
  },

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

  readAllByCampaign(req, res, next) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);

    const find = Object.assign(req.query.find || {}, {
      campaign: req.params.campaign_id,
    });
    const sort = req.query.sort || { createdAt: 1 };

    Question.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(questions => res.json(questions))
    .catch(next);
  },

  readAllByMeCampaign(req, res, next) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);

    const find = Object.assign(req.query.find || {}, {
      campaign: req.params.campaign_id,
    });

    Question.find(find)
    .then(questions => {
      Promise.filter(questions, question => Answer.findOne({
        player: res.locals.user,
        question: question._id,
      }).then(answer => !answer))
      .then(data => res.send({
        docs: data.slice(offset, limit),
        total: data.length,
        limit,
        offset,
      }));
    })
    .catch(next);
  },

  readStatistic(req, res, next) {
    Question.findById(req.params.question_id)
    .then(question => {
      if (!question)
        return res.status(404).end();

      const answers = Array.from({ length: question.answers.length }, (v, k) => k);

      Promise.map(answers, answer => Answer.count({
        question: req.params.question_id,
        personal: answer,
      }))
      .then(data => {
        const total = data.reduce((total, value) => total + value, 0);

        res.send({
          answers: {
            count: data,
            percent: data.map(value => value / total * 100),
            total,
          },
        });
      });
    })
    .catch(next);
  },
};

export default QuestionController;
