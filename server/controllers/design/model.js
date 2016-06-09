/**
 * @author Juan Sanchez
 * @description Model controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Model from '../../models/design/model';
import fs from 'fs';
import path from 'path';

const ModelController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Model.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(models => res.json(models))
    .catch(err => res.status(500).send(err));
  },

  readAllByCompany(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const criteria = Object.assign(req.query.criteria || {}, {
      company: req.params.company_id,
    });

    Model.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(models => res.json(models))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const criteria = Object.assign({
      company: req.params.company_id,
    }, req.body);

    Model.create(criteria)
    .then(model => res.status(201).json(model))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.model_id,
    };

    Model.findOne(criteria)
    .then(model => {
      if (!model)
        return res.status(404).end();
      res.json(model);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.model_id,
    };

    Model.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(model => {
      if (!model)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${model.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.model_id,
    };

    Model.findOneAndRemove(criteria)
    .then(model => {
      if (!model)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${model.url.split('uploads')[1]}`));

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

export default ModelController;
