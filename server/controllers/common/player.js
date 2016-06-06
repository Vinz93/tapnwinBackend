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
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Player.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
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
  update(req, res) {
    Player.findByIdAndUpdate(req.params.player_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    }).catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};

export default PlayerController;
