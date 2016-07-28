/**
 * @author Juan Sanchez
 * @description Mission-Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import mongoose from 'mongoose';
import transaction from 'mongoose-transaction';
import Promise from 'bluebird';

import MissionStatus from '../../models/common/mission_status';
import MissionCampaign from '../../models/common/mission_campaign';
import CampaignStatus from '../../models/common/campaign_status';

const Transaction = transaction(mongoose);

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
    MissionCampaign.find({ campaign: req.params.campaign_id })
    .then(missionCampaigns => Promise.map(missionCampaigns, missionCampaign =>
    MissionStatus.findOne({
      player: res.locals.user.id,
      missionCampaign: missionCampaign.id,
    })
    .populate('missionCampaign')
    .then(missionStatus => {
      if (!missionStatus)
        return MissionStatus.create({
          player: res.locals.user.id,
          missionCampaign: missionCampaign.id,
        })
        .then(missionStatus => MissionStatus.populate(missionStatus, 'missionCampaign'))
        .then(missionStatus => missionStatus);

      return missionStatus;
    })))
    .then(missionStatuses => res.json(missionStatuses))
    .catch(next);
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

    function run() {
      transaction.run(err => {
        if (err)
          return next(err);

        res.status(204).end();
      });
    }

    MissionStatus.findOne({
      player: res.locals.user.id,
      _id: req.params.mission_status_id,
    })
    .populate('missionCampaign')
    .then(missionStatus => {
      if (!missionStatus)
        return res.status(404).end();

      let value = (req.body.value !== undefined) ? parseInt(req.body.value, 10) : 1;
      value += missionStatus.value;

      if (value > missionStatus.missionCampaign.max)
        return res.status(409).end();

      transaction.update('MissionStatus', missionStatus.id, { value });

      if (value === missionStatus.missionCampaign.max) {
        transaction.update('MissionStatus', missionStatus.id, { isDone: true });

        return [
          missionStatus,
          MissionCampaign.find({
            campaign: missionStatus.missionCampaign.campaign,
          })
          .populate('campaign'),
        ];
      }

      throw new Promise.CancellationError();
    })
    .spread((missionStatus, missions) => [
      missionStatus,
      missions,
      CampaignStatus.findOrCreate({
        player: res.locals.user.id,
        campaign: missionStatus.missionCampaign.campaign,
      }),
    ])
    .spread((missionStatus, missions, campaignStatus) => [
      missionStatus,
      missions,
      campaignStatus,
      MissionStatus.find({
        player: res.locals.user.id,
        missionCampaign: { $in: missions.map(mission => mission.id) },
      })
      .populate('missionCampaign'),
    ])
    .spread((missionStatus, missions, campaignStatus, missionStatuses) => {
      if (missionStatuses.reduce((prev, curr) => {
        if (!curr.missionCampaign.isRequired || curr.id === missionStatus.id)
          return prev && true;

        return curr.isDone && prev;
      }, true)) {
        let balance;

        if (missionStatus.missionCampaign.isRequired) {
          balance = missions[0].campaign.balance;

          missionStatuses.forEach(missionStatus => {
            if (missionStatus.isDone && !missionStatus.missionCampaign.isRequired)
              balance += missionStatus.missionCampaign.balance;
          });
        } else
          balance = missionStatus.missionCampaign.balance;

        transaction.update('Player', res.locals.user.id, {
          balance: res.locals.user.balance + balance,
        });
      }

      if (missionStatus.missionCampaign.isBlocking) {
        const data = {};

        data.isBlocked = true;
        data.unblockAt = Date.now() + missionStatus.missionCampaign.blockTime;
        data.m3 = {
          isBlocked: true,
          unblockAt: data.unblockAt,
        };

        transaction.update('CampaignStatus', campaignStatus.id, data);
      }

      run();
    })
    .catch(err => {
      if (err instanceof Promise.CancellationError)
        return run();

      next(err);
    });
  },
};

export default MissionStatusController;
