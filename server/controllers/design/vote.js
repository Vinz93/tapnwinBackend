/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Promise from 'bluebird';
import Design from '../../models/design/design';
import Vote from '../../models/design/vote';
import Sticker from '../../models/design/sticker';

const VoteController = {
  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Vote.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(votes => res.json(votes))
    .catch(err => res.status(500).send(err));
  },

  readAllByDesign(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = Object.assign(req.query.criteria || {}, {
      design: req.params.design_id,
    });

    Vote.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(votes => res.json(votes))
    .catch(err => res.status(500).send(err));
  },

  createByMeDesign(req, res) {
    const data = Object.assign(req.body, {
      design: req.params.design_id,
      player: res.locals.user._id,
    });

    Vote.create(data)
    .then(vote => res.status(201).json(vote))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Vote.findById(req.params.vote_id)
    .then(vote => {
      if (!vote)
        return res.status(404).end();
      res.json(vote);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  readByMeDesign(req, res) {
    const criteria = {
      design: req.params.design_id,
      player: res.locals.user._id,
    };

    Vote.findOne(criteria)
    .then(vote => {
      if (!vote)
        return res.status(404).end();
      res.json(vote);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  readStatisticByDesign(req, res) {
    Design.findById(req.params.design_id)
    .populate('campaign')
    .then((design) => {
      const criteria = {
        company: design.campaign.company,
      };

      Sticker.find(criteria)
      .then(stickers => Promise.map(stickers, sticker => {
        const criteria = {
          design: design._id,
          stickers: sticker._id,
        };

        return Vote.count(criteria)
          .then(count => {
            const data = {
              sticker: sticker._id,
              count,
            };

            return data;
          });
      }).then(data => res.send(data)));
    });
  },

  update(req, res) {
    const criteria = {
      _id: req.params.vote_id,
      player: res.locals.user._id,
    };

    Vote.findAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(vote => {
      if (!vote)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },
};

export default VoteController;
