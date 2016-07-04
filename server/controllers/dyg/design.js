/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Design from '../../models/dyg/design';

const DesignController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Design.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['player', 'topItem', 'midItem', 'botItem', 'model'],
    })
    .then(designs => res.json(designs))
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

    Design.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['topItem', 'midItem', 'botItem', 'model'],
    })
    .then(designs => res.json(designs))
    .catch(next);
  },

  readAllByMeCampaign(req, res, next) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const player = (req.query.exclusive === undefined ||
      req.query.exclusive === 'false') ? res.locals.user._id : {
        $ne: res.locals.user._id,
      };

    const find = Object.assign(req.query.find || {}, {
      campaign: req.params.campaign_id,
      player,
    });
    const sort = req.query.sort || { createdAt: 1 };

    if (req.query.random === 'true') {
      Design.findRandom().limit(limit)
      .then(designs => res.json(designs))
      .catch(next);
    } else {
      const offset = locals.config.paginate.offset(req.query.offset);

      Design.paginate(find, {
        sort,
        offset,
        limit,
        populate: ['topItem', 'midItem', 'botItem', 'model'],
      })
      .then(designs => res.json(designs))
      .catch(next);
    }
  },

  createByMeCampaign(req, res, next) {
    const data = Object.assign(req.body, {
      campaign: req.params.campaign_id,
      player: res.locals.user._id,
    });

    Design.create(data)
    .then(design => res.status(201).json(design))
    .catch(next);
  },

  read(req, res, next) {
    Design.findById(req.params.design_id)
    .then(design => {
      if (!design)
        return res.status(404).end();

      res.json(design);
    })
    .catch(next);
  },

  doesntBelongToMe(req, res, next) {
    const criteria = {
      _id: req.params.design_id,
      player: res.locals.user._id,
    };

    Design.findOne(criteria).then(design => {
      if (!design)
        return next();

      res.status(400).send();
    })
    .catch(next);
  },
};

export default DesignController;
