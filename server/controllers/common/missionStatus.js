/**
 * @author Juan Sanchez
 * @description Mission-Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongooseTransaction from 'mongoose-transaction';
import waterfall from 'async/waterfall';
import Promise from 'bluebird';

import MissionStatus from '../../models/common/missionStatus';
import MissionCampaign from '../../models/common/missionCampaign';
import CampaignStatus from '../../models/common/campaignStatus';
import config from '../../../config/env';

const Transaction = mongooseTransaction(mongoose);

const MissionStatusController = {
  readAllByMe(req, res, next) {
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
      .catch(next);
    })
    .catch(next);
  },

  updateByMe(req, res, next) {
    const transaction = new Transaction();

    waterfall([
      cb => {
        MissionStatus.findOne({
          player: res.locals.user.id,
          _id: req.params.mission_status_id,
        })
        .populate('missionCampaign')
        .then(status => {
          if (!status)
            return res.status(404).end();

          if (status.value === status.missionCampaign.max)
            return res.status(409).end();

          transaction.update('Status', status.id, { value: status.value + 1 });
          cb(null, status);
        })
        .catch(cb);
      },
      (status, cb) => {
        if (status.value + 1 === status.missionCampaign.max) {
          transaction.update('Status', status.id, { isDone: true });
          cb(null, status);
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
        MissionStatus.find({
          player: res.locals.user.id,
          missionCampaign: { $in: missions.map(mission => mission.id) },
        })
        .populate('missionCampaign')
        .then(statuses => cb(null, status, missions, campaignStatus, statuses))
        .catch(cb);
      },
      (status, missions, campaignStatus, statuses, cb) => {
        if (statuses.reduce((prev, curr) => {
          if (!curr.missionCampaign.isRequired || curr.id === status.id) {
            return prev && true;
          }
          return curr.isDone && prev;
        }, true)) {
          let balance;
          if (status.missionCampaign.isRequired) {
            balance = missions[0].campaign.balance;

            statuses.forEach(status => {
              if (status.isDone && !status.missionCampaign.isRequired)
                balance += status.missionCampaign.balance;
            });
          } else {
            balance = status.missionCampaign.balance;
          }
          transaction.update('Player', res.locals.user.id,
          { balance: res.locals.user.balance + balance });
        }
        cb(null, status, missions, campaignStatus, statuses);
      },
      (status, missions, campaignStatus, statuses, cb) => {
        if (status.missionCampaign.isBlocking) {
          const block = {};
          config.games.forEach(game => {
            if (missions[0].campaign[game.name].canBeBlocked)
              block[game.name] = false;
          });

          transaction.update('CampaignStatus', campaignStatus.id, block);
        }
        cb(null);
      },
    ], (err) => {
      if (err && !err.done) {
        next(err);
      }
      transaction.run(err => {
        if (err)
          return next(err);

        res.status(204).end();
      });
    });
  },
};

export default MissionStatusController;
