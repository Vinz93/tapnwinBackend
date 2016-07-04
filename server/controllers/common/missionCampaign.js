/**
 * @author Juan Sanchez
 * @description Mission-Campaign controller definition
 * @lastModifiedBy Juan Sanchez
 */

import MissionCampaign from '../../models/common/missionCampaign';

const MissionCampaignController = {

  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    MissionCampaign.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(missions => res.json(missions))
    .catch(next);
  },

  create(req, res, next) {
    MissionCampaign.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(next);
  },

  read(req, res, next) {
    MissionCampaign.findById(req.params.missionCampaign_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();
      res.json(mission);
    })
    .catch(next);
  },

  update(req, res, next) {
    MissionCampaign.findByIdAndUpdate(req.params.missionCampaign_id, req.body, {
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
    MissionCampaign.findByIdAndRemove(req.params.missionCampaign_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default MissionCampaignController;
