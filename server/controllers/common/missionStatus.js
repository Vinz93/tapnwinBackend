/**
 * @author Juan Sanchez
 * @description Mission-Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import MissionStatus from '../../models/common/missionStatus';
import MissionCampaign from '../../models/common/missionCampaign';
import CampaignStatus from '../../models/common/campaignStatus';
import config from '../../../config/env';

import waterfall from 'async/waterfall';
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
    waterfall([
      cb => {
        MissionStatus.findOne({
          player: res.locals.user.id,
          _id: req.params.missionStatus_id,
        })
        .populate('missionCampaign')
        .then(status => {
          if (!status)
            return res.status(404).end();

          if (status.value === status.missionCampaign.max)
            return res.status(409).end();

          status.update({ $inc: { value: 1 } })
          .then(() => cb(null, status))
          .catch(cb);
        })
        .catch(cb);
      },
      (status, cb) => {
        if (status.value + 1 === status.missionCampaign.max) {
          status.update({ isDone: true })
          .then(() => cb(null, status))
          .catch(cb);
        } else {
          cb({ done: true });
        }
      },
      (status, cb) => {
        MissionCampaign.find({
          campaign: status.missionCampaign.campaign,
        })
        .populate('campaign')
        .then(missions => cb(null, status, missions))
        .catch(cb);
      },
      (status, missions, cb) => {
        CampaignStatus.findOne({
          player: res.locals.user.id,
          campaign: status.missionCampaign.campaign,
        }, (err, campaignStatus) => {
          if (err) {
            if (err.id)
              campaignStatus = err; // eslint-disable-line
            else
              return cb(err);
          }
          cb(null, status, missions, campaignStatus);
        });
      },
      (status, missions, campaignStatus, cb) => {
        const missionsMapped =
        missions.reduce((prev, curr) => {
          curr.isRequired ? prev.required.push(curr) : prev.optional.push(curr); // eslint-disable-line
          return prev;
        }, {
          required: [],
          optional: [],
        });
        MissionStatus.find({
          player: res.locals.user.id,
          missionCampaign: { $in: missionsMapped.required.map(mission => mission.id) },
        })
        .populate('missionCampaign')
        .then(statuses => cb(null, status, missions, campaignStatus, statuses))
        .catch(cb);
      },
      (status, missions, campaignStatus, statuses, cb) => {
        if (statuses.reduce((prev, curr) => prev && curr.isDone, true)) {
          let balance;
          if (status.missionCampaign.isRequired) {
            balance = missions[0].campaign.balance;

            statuses.map(status => { // eslint-disable-line array-callback-return
              if (status.isDone && !status.isRequired)
                balance += status.missionCampaign.balance;
            });
          } else {
            balance = status.missionCampaign.balance;
          }

          res.locals.user.update({ $inc: { balance } })
          .then(() => cb(null, status, missions, campaignStatus, statuses))
          .catch(cb);
        } else {
          cb(null, status, missions, campaignStatus, statuses);
        }
      },
      (status, missions, campaignStatus, statuses, cb) => {
        if (status.missionCampaign.isBlocking) {
          const block = {};
          config.games.map(game => { // eslint-disable-line
            if (missions[0].campaign[game.name].canBeBlocked)
              block[game.name] = false;
          });

          campaignStatus.update(block)
          .then(() => cb(null))
          .catch(cb);
        } else {
          cb(null);
        }
      },
    ], (err) => {
      if (err) {
        if (err.done)
          return res.status(204).end();
        if (err.name === 'CastError' || err.name === 'ValidationError')
          return res.status(400).send(err);
        return res.status(500).send(err);
      }
      res.status(204).end();
    });
  },
};

export default MissionStatusController;
