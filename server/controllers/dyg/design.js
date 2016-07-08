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

  readAllByMe(req, res, next) {
    const locals = req.app.locals;
    const limit = locals.config.paginate.limit(req.query.limit);
    const player = (req.query.exclusive === undefined ||
      req.query.exclusive === 'false') ? res.locals.user._id : {
        $ne: res.locals.user._id,
      };

    const find = Object.assign(req.query.find || {}, {
      player,
    });
    const sort = req.query.sort || { createdAt: 1 };

    if (req.query.random === 'true') {
      Design.findRandom(find).limit(limit).sort(sort)
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

  createByMe(req, res, next) {
    const data = Object.assign(req.body, {
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
};

export default DesignController;
