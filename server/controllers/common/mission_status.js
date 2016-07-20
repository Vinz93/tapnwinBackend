/**
 * @author Juan Sanchez
 * @description Mission-Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import mongooseTransaction from 'mongoose-transaction';
import waterfall from 'async/waterfall';
import Promise from 'bluebird';

import MissionStatus from '../../models/common/mission_status';
import MissionCampaign from '../../models/common/mission_campaign';
import CampaignStatus from '../../models/common/campaign_status';

const Transaction = mongooseTransaction(mongoose);

const MissionStatusController = {
/**
 * @swagger
 * /api/v1/players/me/campaigns/{campaign_id}/mission_statuses:
 *   get:
 *     tags:
 *       - MissionStatuses
 *     description: Returns all campaign's missionStatuses
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: campaign_id
 *         description: Campaign's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An array of missionStatuses
 *         schema:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/definitions/MissionStatus'
 *               - properties:
 *                   id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
  readAllByMe(req, res, next) {
    waterfall([
      cb => {
        MissionCampaign.find({ campaign: req.params.campaign_id })
        .then(missionCampaign => {
          if (missionCampaign.length === 0)
            cb({ done: true }, []);

          cb(null, missionCampaign);
        })
        .catch(cb);
      },
      (missionCampaign, cb) => {
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
        .then(statuses => cb(null, statuses))
        .catch(cb);
      },
    ], (err, statuses) => {
      if (err && !err.done)
        return next(err);

      res.json(statuses);
    });
  },

/**
 * @swagger
 * /api/v1/players/me/mission_statuses/{mission_status_id}:
 *   patch:
 *     tags:
 *       - MissionStatuses
 *     description: Updates a player's missionStatus
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: mission_status_id
 *         description: missionStatus's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: missionStatus
 *         description: missionStatus object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MissionStatus'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
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
        } else
          cb({ done: true });
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
          if (!curr.missionCampaign.isRequired || curr.id === status.id)
            return prev && true;

          return curr.isDone && prev;
        }, true)) {
          let balance;

          if (status.missionCampaign.isRequired) {
            balance = missions[0].campaign.balance;

            statuses.forEach(status => {
              if (status.isDone && !status.missionCampaign.isRequired)
                balance += status.missionCampaign.balance;
            });
          } else
            balance = status.missionCampaign.balance;

          transaction.update('Player', res.locals.user.id, {
            balance: res.locals.user.balance + balance,
          });
        }

        cb(null, status, missions, campaignStatus, statuses);
      },
      (status, missions, campaignStatus, statuses, cb) => {
        if (status.missionCampaign.isBlocking) {
          const data = {};

          data.isBlocked = true;
          data.unblockAt = new Date() + status.missionCampaign.blockTime;
          data.m3 = {
            isBlocked: true,
            unblockAt: data.unblockAt,
          };

          transaction.update('CampaignStatus', campaignStatus.id, data);
        }

        cb(null);
      },
    ], (err) => {
      if (err && !err.done)
        return next(err);

      transaction.run(err => {
        if (err)
          return next(err);

        res.status(204).end();
      });
    });
  },
};

export default MissionStatusController;
