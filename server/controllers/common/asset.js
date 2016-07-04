/**
 * @author Juan Sanchez
 * @description Model controller definition
 * @lastModifiedBy Juan Sanchez
 */

import fs from 'fs';
import path from 'path';

import Asset from '../../models/common/asset';

const AssetController = {
  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Asset.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(assets => res.json(assets))
    .catch(err => res.status(500).send(err));
  },

  readAllByCompany(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = Object.assign(req.query.criteria || {}, {
      company: req.params.company_id,
    });

    Asset.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company'],
    })
    .then(assets => res.json(assets))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const data = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Asset.create(data)
    .then(asset => res.status(201).json(asset))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Asset.findById(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return res.status(404).end();
      res.json(asset);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Asset.findByIdAndUpdate(req.params.asset_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(asset => {
      if (!asset)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${asset.url.split('uploads')[1]}`));

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
    Asset.findByIdAndRemove(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${asset.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },
};

export default AssetController;
