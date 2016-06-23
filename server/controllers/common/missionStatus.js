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

      Promise.map(missionCampaign, mission =>
        MissionStatus.findOne({
          player: res.locals.user.id,
          missionCampaign: mission.id,
        })
        .populate('missionCampaign')
        .then(status => {
          if (!status)
            return MissionStatus.create({
              player: res.locals.user.id,
              missionCampaign: mission.id,
            })
            .then(newStatus => newStatus);
          return status;
        })
      )
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
      _id: req.params.missionStatus_id,
    };

    MissionStatus.findOneAndUpdate(criteria, { $inc: { value: 1 } }, {
      runValidators: true,
      context: 'query',
    })
    .populate('missionCampaign')
    .then(status => {
      if (!status)
        return res.status(404).end();
      if (status.value + 1 >= status.missionCampaign.max) {
        return status.update({ isDone: true }).then(() => {
          if (status.missionCampaign.isRequired) {
            return MissionCampaign.find({
              campaign: status.missionCampaign.campaign,
              isRequired: true,
            })
            .populate('campaign')
            .then(missionCampaign => {
              MissionStatus.find({
                player: res.locals.user.id,
                missionCampaign: { $in: missionCampaign.map(mission => mission.id) },
              })
              .then(statuses => {
                if (statuses.reduce((prev, curr) => prev && curr.isDone, true)) {
                  res.locals.user.update({ $inc: { balance: missionCampaign[0].campaign.balance } })
                  .then(() => res.status(204).end())
                  .catch(err => {
                    if (err.name === 'CastError' || err.name === 'ValidationError') {
                      return res.status(400).send(err);
                    }
                    return res.status(500).send(err);
                  });
                }
              })
              .catch(err => {
                console.log(err);
                if (err.name === 'CastError' || err.name === 'ValidationError') {
                  return res.status(400).send(err);
                }
                return res.status(500).send(err);
              });
            })
            .catch(err => {
              if (err.name === 'CastError' || err.name === 'ValidationError') {
                return res.status(400).send(err);
              }
              return res.status(500).send(err);
            });
          }
          return res.locals.user.update({ $inc: { balance: status.missionCampaign.balance } })
          .then(() => res.status(204).end())
          .catch(err => {
            if (err.name === 'CastError' || err.name === 'ValidationError') {
              return res.status(400).send(err);
            }
            return res.status(500).send(err);
          });
        });
      }
      return res.status(204).end();
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
