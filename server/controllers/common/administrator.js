/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Administrator from '../../models/common/administrator';

const AdminController = {
  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Administrator.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(administrators => res.json(administrators))
    .catch(err => res.status(500).send(err));
  },
  create(req, res) {
    Administrator.create(req.body)
    .then(administrator => res.status(201).json(administrator))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
  update(req, res) {
    Administrator.findByIdAndUpdate(req.params.administrator_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(user => {
      if (!user)
        return res.status(404).end();

      res.status(204).end();
    }).catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};

export default AdminController;
