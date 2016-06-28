/**
 * @author Andres Alvarez
 * @description Question controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Promise from 'bluebird';

import Question from '../../models/voice/question';
import Answer from '../../models/voice/answer';

const QuestionController = {
  read(req, res) {
    Question.findById(req.params.question_id)
    .then(question => {
      if (!question)
        return res.status(404).end();

      res.json(question);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Question.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(questions => res.json(questions))
    .catch(err => res.status(500).send(err));
  },

  readAllByCampaign(req, res) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);
    const criteria = Object.assign(req.query.criteria || {}, {
      campaign: req.params.campaign_id,
    });

    Question.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(questions => res.json(questions))
    .catch(err => res.status(500).send(err));
  },

  readAllByMeCampaign(req, res) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);
    const criteria = Object.assign(req.query.criteria || {}, {
      campaign: req.params.campaign_id,
    });

    Question.find(criteria)
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
    .catch(err => res.status(500).send(err));
  },

  readStatistic(req, res) {
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
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};

export default QuestionController;
