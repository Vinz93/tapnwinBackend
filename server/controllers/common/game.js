/**
 * @author Juan Sanchez
 * @description Game controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Game from '../../models/common/game';

const GameController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Game.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(games => res.json(games))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    Game.create(req.body)
    .then(game => res.status(201).json(game))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Game.findById(req.params.game_id)
    .then(game => {
      if (!game)
        return res.status(404).end();
      res.json(game);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Game.findByIdAndUpdate(req.params.game_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(game => {
      if (!game)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Game.findByIdAndRemove(req.params.game_id)
    .then(game => {
      if (!game)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },
};

export default GameController;
