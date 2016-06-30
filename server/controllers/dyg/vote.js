/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Promise from 'bluebird';
import Design from '../../models/dyg/design';
import Vote from '../../models/dyg/vote';

const VoteController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Vote.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(votes => res.json(votes))
    .catch(next);
  },

  readAllByDesign(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = Object.assign(req.query.find || {}, {
      design: req.params.design_id,
    });
    const sort = req.query.sort || { createdAt: 1 };

    Vote.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(votes => res.json(votes))
    .catch(next);
  },

  createByMeDesign(req, res, next) {
    const data = Object.assign(req.body, {
      design: req.params.design_id,
      player: res.locals.user._id,
    });

    Vote.create(data)
    .then(vote => res.status(201).json(vote))
    .catch(next);
  },

  read(req, res, next) {
    Vote.findById(req.params.vote_id)
    .then(vote => {
      if (!vote)
        return res.status(404).end();
      res.json(vote);
    })
    .catch(next);
  },

  readByMeDesign(req, res, next) {
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
    .catch(next);
  },

  readStatisticByDesign(req, res, next) {
    Design.findById(req.params.design_id)
    .populate('campaign')
    .then(design => {
      if (!design)
        return res.status(404).end();

      Promise.map(design.campaign.design.stickers, sticker => {
        const criteria = {
          design: design._id,
          stickers: sticker,
        };

        return Vote.count(criteria)
          .then(count => {
            const data = {
              sticker,
              count,
            };

            return data;
          });
      })
      .then(data => res.send(data));
    })
    .catch(next);
  },

  update(req, res, next) {
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
    .catch(next);
  },
};

export default VoteController;
