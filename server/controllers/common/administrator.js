/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Administrator from '../../models/common/administrator';

const AdminController = {
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
