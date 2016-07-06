/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres ALvarez
 */

import Category from '../../models/dyg/category';

const CategoryController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Category.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['company'],
    })
    .then(categories => res.json(categories))
    .catch(next);
  },

  create(req, res, next) {
    Category.create(req.body)
    .then(category => res.status(201).json(category))
    .catch(next);
  },

  read(req, res, next) {
    Category.findById(req.params.category_id)
    .populate('company')
    .then(category => {
      if (!category)
        return res.status(404).end();
      res.json(category);
    })
    .catch(next);
  },

  update(req, res, next) {
    Category.findByIdAndUpdate(req.params.category_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(category => {
      if (!category)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(next);
  },

  delete(req, res, next) {
    Category.findByIdAndRemove(req.params.category_id)
    .then(category => {
      if (!category)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default CategoryController;
