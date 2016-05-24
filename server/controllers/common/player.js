/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Player from '../../models/common/player';

const PlayerController = {
  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Player.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['userId'],
    })
    .then(player => res.json(player))
    .catch(err => res.status(500).send(err));
  },
  create(req, res) {
    Player.create(req.body)
    .then(player => res.status(201).json(player))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
};

export default PlayerController;
