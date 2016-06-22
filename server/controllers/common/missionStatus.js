/**
 * @author Juan Sanchez
 * @description Mission-Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import MissionStatus from '../../models/common/missionStatus';
import MissionCampaign from '../../models/common/missionCampaign';

import Promise from 'bluebird';

const MissionStatusController = {

  readAllByMe(req, res) {
    MissionCampaign.find({ campaign: req.params.campaign_id })
    .then(missionCampaign => {
      if (missionCampaign.length === 0)
        return res.json([]);

      return Promise.map(missionCampaign, mission => {
        MissionStatus.findOrCreate({
          player: res.locals.user.id,
          missionCampaign: mission.id,
        })
        .then(status => status);
      })
      .then(statuses => res.json(statuses))
      .catch(err => {
        if (err.name === 'CastError') {
          return res.status(400).send(err);
        }
        return res.status(500).send(err);
      });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  updateByMe(req, res) {
    const criteria = {
      player: res.locals.user.id,
      missionCampaign: req.params.campaign_id,
    };

    MissionStatus.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(status => {
      if (!status)
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
};

export default MissionStatusController;
