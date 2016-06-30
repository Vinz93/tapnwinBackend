/**
 * @author Juan Sanchez
 * @description Item controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Item from '../../models/dyg/item';
import fs from 'fs';
import path from 'path';

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
      populate: ['company'],
    })
    .then(items => res.json(items))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const data = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Item.create(data)
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

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${item.url.split('uploads')[1]}`));

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

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${item.url.split('uploads')[1]}`));

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
