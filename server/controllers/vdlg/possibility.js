/**
 * @author Juan Sanchez
 * @description Possibility controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Possibility from '../../models/dyg/model';
import fs from 'fs';
import path from 'path';

const PossibilityController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Possibility.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['company'],
    })
    .then(possibilities => res.json(possibilities))
    .catch(next);
  },

  create(req, res, next) {
    const data = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Possibility.create(data)
    .then(possibility => res.status(201).json(possibility))
    .catch(next);
  },

  read(req, res, next) {
    Possibility.findById(req.params.model_id)
    .then(possibility => {
      if (!possibility)
        return res.status(404).end();
      res.json(possibility);
    })
    .catch(next);
  },

  update(req, res, next) {
    Possibility.findByIdAndUpdate(req.params.model_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(possibility => {
      if (!possibility)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${possibility.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },
};

export default PossibilityController;
