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
      populate: ['items'],
    })
    .then(categories => res.json(categories))
    .catch(err => res.status(500).send(err));
  },

  readAllByCampaign(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = Object.assign(req.query.criteria || {}, {
      campaign: req.params.campaign_id,
    });

    Category.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['items'],
    })
    .then(categories => res.json(categories))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const criteria = Object.assign({
      campaign: req.params.campaign_id,
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
    Category.findById(req.params.category_id)
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
    Category.findByIdAndUpdate(req.params.category_id, req.body, {
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
    Category.findByIdAndRemove(req.params.category_id)
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
