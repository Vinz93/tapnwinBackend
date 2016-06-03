/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Design from '../../models/design/design';

const DesignController = {
  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Design.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['player', 'campaign', 'topItem', 'midItem', 'botItem'],
    })
    .then(designs => res.json(designs))
    .catch(err => res.status(500).send(err));
  },

  readAllByCampaign(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);
    const criteria = Object.assign(req.query.criteria || {}, {
      campaign: req.params.campaign_id,
    });

    Design.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['player', 'topItem', 'midItem', 'botItem'],
    })
    .then(designs => res.json(designs))
    .catch(err => res.status(500).send(err));
  },

  readAllByMeCampaign(req, res) {
    const locals = req.app.locals;
    const limit = locals.config.limit(req.query.limit);
    const player = (!req.query.exclusive) ? res.locals.user._id : {
      $ne: res.locals.user._id,
    };
    const criteria = Object.assign(req.query.criteria || {}, {
      campaign: req.params.campaign_id,
      player,
    });

    if (req.query.random) {
      Design.findRandom().limit(limit)
      .then(designs => res.json(designs))
      .catch(err => res.status(500).send(err));
    } else {
      const offset = locals.config.offset(req.query.offset);

      Design.paginate(criteria, {
        sort: {
          createdAt: 1,
        },
        offset,
        limit,
        populate: ['topItem', 'midItem', 'botItem'],
      })
      .then(designs => res.json(designs))
      .catch(err => res.status(500).send(err));
    }
  },

  create(req, res) {
    const criteria = Object.assign({
      campaign: req.params.campaign_id,
    }, req.body);

    Design.create(criteria)
    .then(design => res.status(201).json(design))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Design.findById(req.params.design_id)
    .then(design => {
      if (!design)
        return res.status(404).end();
      res.json(design);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Design.findByIdAndUpdate(req.params.design_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(design => {
      if (!design)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Design.findByIdAndRemove(req.params.design_id)
    .then(design => {
      if (!design)
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

export default DesignController;
