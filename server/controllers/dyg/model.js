/**
 * @author Juan Sanchez
 * @description Model controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Model from '../../models/dyg/model';
import fs from 'fs';
import path from 'path';

const ModelController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Model.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['company'],
    })
    .then(models => res.json(models))
    .catch(next);
  },

  create(req, res, next) {
    const data = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Model.create(data)
    .then(model => res.status(201).json(model))
    .catch(next);
  },

  update(req, res, next) {
    Model.findByIdAndUpdate(req.params.model_id, req.body, {
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
    .catch(next);
  },
};

export default ModelController;
