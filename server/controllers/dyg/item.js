/**
 * @author Juan Sanchez
 * @description Item controller definition
 * @lastModifiedBy Juan Sanchez
 */

import fs from 'fs';
import path from 'path';

import Item from '../../models/dyg/item';

const ItemController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Item.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['company'],
    })
    .then(items => res.json(items))
    .catch(next);
  },

  create(req, res, next) {
    Item.create(req.body)
    .then(item => res.status(201).json(item))
    .catch(next);
  },

  read(req, res, next) {
    Item.findById(req.params.item_id)
    .then(item => {
      if (!item)
        return res.status(404).end();

      res.json(item);
    })
    .catch(next);
  },

  update(req, res, next) {
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
    .catch(next);
  },

  delete(req, res, next) {
    Item.findByIdAndRemove(req.params.item_id)
    .then(item => {
      if (!item)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${item.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },
};

export default ItemController;
