/**
 * @author Andres Alvarez
 * @description Answer controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Promise from 'bluebird';

import Answer from '../../models/vdlg/answer';

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

  readAllByMeCampaign(req, res, next) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);

    const find = Object.assign(req.query.find || {}, {
      player: res.locals.user._id,
    });

    Answer.find(find)
    .populate('question')
    .then(answers => {
      answers.filter(answer => answer.question.campaign.toString() === req.params.campaign_id);
      res.send({
        docs: answers.slice(offset, limit),
        total: answers.length,
        limit,
        offset,
      });
    })
    .catch(next);
  },

  readStatisticByMeCampaign(req, res, next) {
    const find = Object.assign(req.query.find || {}, {
      player: res.locals.user._id,
    });

    Answer.find(find)
    .populate('question')
    .then(answers => {
      const fanswers = answers.filter(answer => answer.question.campaign.toString() ===
        req.params.campaign_id);

      Promise.map(fanswers, answer => {
        const question = answer.question;
        const answers = Array.from({ length: answer.question.answers.length }, (v, k) => k);

        return Promise.map(answers, answer => Answer.count({
          question: question._id,
          personal: answer,
        }))
        .then(data => data.indexOf(Math.max(...data)));
      })
      .then(data => {
        const correct = fanswers.filter((answer, i) => answer.popular === data[i]).length;
        const total = fanswers.length;

        res.send({
          correct,
          total,
          percent: correct / total * 100,
        });
      });
    })
    .catch(next);
  },

  createByMeQuestion(req, res, next) {
    const data = Object.assign(req.body, {
      player: res.locals.user._id,
      question: req.params.question_id,
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
