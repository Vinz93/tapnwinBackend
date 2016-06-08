/**
 * @author Juan Sanchez
 * @description Item controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Item from '../../models/design/item';

const ItemController = {

  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Item.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(items => res.json(items))
    .catch(err => res.status(500).send(err));
  },

  readAllByCompany(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const criteria = Object.assign(req.query.criteria || {}, {
      company: req.params.company_id,
    });

    Item.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(items => res.json(items))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const criteria = Object.assign({
      company: req.params.company_id,
    }, req.body);

    Item.create(criteria)
    .then(item => res.status(201).json(item))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.item_id,
    };

    Item.findById(criteria)
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
    const criteria = {
      company: req.params.company_id,
      _id: req.params.item_id,
    };

    Item.findByIdAndUpdate(criteria, req.body, {
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
    const criteria = {
      company: req.params.company_id,
      _id: req.params.item_id,
    };

    Item.findByIdAndRemove(criteria)
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

export default ItemController;
