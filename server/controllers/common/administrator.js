/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Administrator from '../../models/common/administrator';

const AdminController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Administrator.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(administrators => res.json(administrators))
    .catch(next);
  },

  create(req, res, next) {
    Administrator.create(req.body)
    .then(administrator => res.status(201).json(administrator))
    .catch(next);
  },

  update(req, res, next) {
    Administrator.findByIdAndUpdate(req.params.administrator_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default AdminController;
