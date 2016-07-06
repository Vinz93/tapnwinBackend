/**
 * @author Juan Sanchez
 * @description Mission controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Mission from '../../models/common/mission';

const MissionController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Mission.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(missions => res.json(missions))
    .catch(next);
  },

  create(req, res, next) {
    Mission.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(next);
  },

  read(req, res, next) {
    Mission.findById(req.params.mission_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();
      res.json(mission);
    })
    .catch(next);
  },

  update(req, res, next) {
    Mission.findByIdAndUpdate(req.params.mission_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(mission => {
      if (!mission)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(next);
  },

  delete(req, res, next) {
    Mission.findByIdAndRemove(req.params.mission_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default MissionController;
