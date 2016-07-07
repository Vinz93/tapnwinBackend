/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import waterfall from 'async/waterfall';
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

  createByMe(req, res, next) {
    const data = Object.assign(req.body, {
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
    waterfall([
      cb => {
        Design.findById(req.params.design_id)
        .populate('campaign')
        .then(design => cb(null, design))
        .catch(cb);
      },
      (design, cb) => {
        if (!design)
          return res.status(404).end();

        Promise.map(design.campaign.dyg.stickers, sticker => Vote.count({
          design: design._id,
          stickers: sticker,
        })
        .then(count => {
          const data = {
            sticker,
            count,
          };

          return data;
        }))
        .then(data => cb(null, data));
      },
    ], (err, data) => {
      if (err)
        next(err);

      res.send(data);
    });
  },

  update(req, res, next) {
    const criteria = {
      _id: req.params.vote_id,
      player: res.locals.user._id,
    };

    Vote.findOneAndUpdate(criteria, req.body, {
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
