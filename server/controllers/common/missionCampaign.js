/**
 * @author Juan Sanchez
 * @description Mission-Campaign controller definition
 * @lastModifiedBy Juan Sanchez
 */

import MissionCampaign from '../../models/common/missionCampaign';

const MissionCampaignController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    MissionCampaign.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(missions => res.json(missions))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    MissionCampaign.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    MissionCampaign.findById(req.params.missionCampaign_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();
      res.json(mission);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    MissionCampaign.findByIdAndUpdate(req.params.missionCampaign_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(mission => {
      if (!mission)
        return res.status(404).end();
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
    MissionCampaign.findByIdAndRemove(req.params.missionCampaign_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

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

export default MissionCampaignController;
