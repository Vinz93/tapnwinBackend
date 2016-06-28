/**
 * @author Andres Alvarez
 * @description Answer controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Answer from '../../models/voice/answer';

const AnswerController = {
  read(req, res) {
    Answer.findById(req.params.answer_id)
    .then(answer => {
      if (!answer)
        return res.status(404).end();

      res.json(answer);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },

  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Answer.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(answers => res.json(answers))
    .catch(err => res.status(500).send(err));
  },

  readAllByMeCampaign(req, res) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const offset = locals.config.paginate.offset(req.query.offset);
    const criteria = Object.assign(req.query.criteria || {}, {
      player: res.locals.user._id,
    });

    Answer.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: {
        path: 'question',
        match: { campaign: req.params.campaign_id },
      },
    })
    .then(answers => res.json(answers))
    .catch(err => res.status(500).send(err));
  },

  createByMeQuestion(req, res) {
    const data = Object.assign(req.body, {
      player: res.locals.user._id,
      question: req.params.question_id,
    });

    Answer.create(data)
    .then(answer => res.status(201).json(answer))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },

  updateByMe(req, res) {
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
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },
};

export default AnswerController;