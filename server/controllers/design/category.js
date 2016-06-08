/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres ALvarez
 */

import Category from '../../models/design/category';

const CategoryController = {
  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Category.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(categories => res.json(categories))
    .catch(err => res.status(500).send(err));
  },

  readAllByCompany(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const criteria = Object.assign(req.query.criteria || {}, {
      company: req.params.company_id,
    });

    Category.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(categories => res.json(categories))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const criteria = Object.assign({
      company: req.params.company_id,
    }, req.body);

    Category.create(criteria)
    .then(category => res.status(201).json(category))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.category_id,
    };

    Category.findById(criteria)
    .then(category => {
      if (!category)
        return res.status(404).end();
      res.json(category);
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
      _id: req.params.category_id,
    };

    Category.findByIdAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(category => {
      if (!category)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.category_id,
    };

    Category.findByIdAndRemove(criteria)
    .then(category => {
      if (!category)
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

export default CategoryController;
