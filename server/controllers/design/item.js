/**
 * @author Juan Sanchez
 * @description Item controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Item from '../../models/design/item';

const GameController = {
  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Item.paginate(criteria, {
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
    Item.create(req.body)
    .then(item => res.status(201).json(item))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Item.findById(req.params.item_id)
    .then(item => {
      if (!item)
        return res.status(404).end();
      res.json(item);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Item.findByIdAndUpdate(req.params.item_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(item => {
      if (!item)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Item.findByIdAndRemove(req.params.item_id)
    .then(item => {
      if (!item)
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

export default GameController;
