/**
 * @author Juan Sanchez
 * @description Model controller definition
 * @lastModifiedBy Juan Sanchez
 */

import fs from 'fs';
import path from 'path';

import Asset from '../../models/common/asset';

const AssetController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Asset.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(assets => res.json(assets))
    .catch(next);
  },

  create(req, res, next) {
    Asset.create(req.body)
    .then(asset => res.status(201).json(asset))
    .catch(next);
  },

  read(req, res, next) {
    Asset.findById(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return res.status(404).end();

      res.json(asset);
    })
    .catch(next);
  },

  update(req, res, next) {
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
    .catch(next);
  },

  delete(req, res, next) {
    Asset.findByIdAndRemove(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${asset.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },
};

export default AssetController;
