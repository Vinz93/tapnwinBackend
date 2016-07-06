/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Player from '../../models/common/player';

const PlayerController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Player.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(player => res.json(player))
    .catch(next);
  },

  create(req, res, next) {
    Player.create(req.body)
    .then(player => res.status(201).json(player))
    .catch(next);
  },

  update(req, res, next) {
    Player.findByIdAndUpdate(req.params.player_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default PlayerController;
