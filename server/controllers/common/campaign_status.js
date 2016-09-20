/**
 * @author Juan Sanchez
 * @description Status controller definition
 * @lastModifiedBy Carlos Avilan
 */

import httpStatus from 'http-status';
import timeUnit from 'time-unit';
import Promise from 'bluebird';

import APIError from '../../helpers/api_error';
import CampaignStatus from '../../models/common/campaign_status';
import MissionCampaign from '../../models/common/mission_campaign';
import MissionStatus from '../../models/common/mission_status';

const StatusController = {
/**
 * @swagger
 * /players/me/campaigns/{campaign_id}/campaign_status:
 *   get:
 *     tags:
 *       - CampaignStatuses
 *     description: Returns a campaignStatus
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
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
 *         description: A campaignStatus
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/CampaignStatus'
 *              - properties:
 *                  id:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                  updatedAt:
 *                    type: string
 *                    format: date-time
 */
  readByMe(req, res, next) {
    CampaignStatus.findOrCreate({
      player: res.locals.user._id,
      campaign: req.params.campaign_id,
    })
    .then(campaignStatus => {
      res.json(campaignStatus);
    })
    .catch(next);
  },

/**
 * @swagger
 * /players/me/campaign_statuses/{campaign_status_id}:
 *   patch:
 *     tags:
 *       - CampaignStatuses
 *     description: Updates my campaignStatus
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: campaign_status_id
 *         description: CampaignStatus' id
 *         in: path
 *         required: true
 *         type: string
 *       - name: campaignStatus
 *         description: CampaignStatus object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CampaignStatus'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  updateByMe(req, res, next) {
    CampaignStatus.findOne({
      _id: req.params.campaign_status_id,
      player: res.locals.user._id,
    })
    .then(campaignStatus => {
      if (!campaignStatus)
        return Promise.reject(new APIError('CampaignStatus not found', httpStatus.NOT_FOUND));

      campaignStatus.set(req.body);

      return campaignStatus.save();
    })
    .then(campaignStatus => CampaignStatus.populate(campaignStatus, 'campaign'))
    .then(campaignStatus =>
      [
        campaignStatus,
        MissionCampaign.find({
          campaign: campaignStatus.campaign,
        }),
      ]
    )
    .spread((campaignStatus, missionCampaigns) => [
      campaignStatus,
      missionCampaigns,
      Promise.map(missionCampaigns, missionCampaign =>
        MissionStatus.findOne({
          player: res.locals.user.id,
          missionCampaign: missionCampaign.id,
        })
        .populate({
          path: 'missionCampaign',
          model: 'MissionCampaign',
          populate: [
            {
              path: 'mission',
              model: 'Mission',
            },
          ],
        })
        .then(missionStatus => {
          if (!missionStatus) {
            return MissionStatus.create({
              player: res.locals.user.id,
              missionCampaign: missionCampaign.id,
            })
            .then(missionStatus => MissionStatus.populate(missionStatus, {
              path: 'missionCampaign',
              model: 'MissionCampaign',
              populate: [
                {
                  path: 'mission',
                  model: 'Mission',
                },
              ],
            }));
          }
          return missionStatus;
        })
      ),
    ])
    .spread((campaignStatus, missionCampaigns, missionStatuses) => {
      let missionsCompleted = missionStatuses.filter(item => {
        const code = item.missionCampaign.mission.code;
        if (code === '0101') {
          // Hacer (N) diseños
          return !item.isDone && campaignStatus.dyg.dressed >= item.missionCampaign.max;
        }
        if (code === '0104') {
          // Votar en (N) diseños
          return !item.isDone && campaignStatus.dyg.votesGiven >= item.missionCampaign.max;
        }
        if (code === '0105') {
          // Tener (N) votos en uno de los diseños propios
          return !item.isDone && campaignStatus.dyg.votesReceived >= item.missionCampaign.max;
        }
        if (code === '0201') {
          // Completar (N) preguntas
          return !item.isDone && campaignStatus.vdlg.answered >= item.missionCampaign.max;
        }
        if (code === '0202') {
          // Predecir (N) preguntas
          return !item.isDone && campaignStatus.vdlg.correct >= item.missionCampaign.max;
        }
        if (code === '0301') {
          // Alcanzar (N) puntos.
          return !item.isDone && campaignStatus.m3.score >= item.missionCampaign.max;
        }
        return false;
      });

      missionsCompleted = missionsCompleted.map(item => {
        const code = item.missionCampaign.mission.code;
        if (code === '0101') {
          // Hacer (N) diseños
          campaignStatus.dyg.isBlocked = true;
          campaignStatus.dyg.unblockAt = new Date(Date.now() +
            timeUnit.hours.toMillis(item.missionCampaign.blockTime));
        }
        if (code === '0104') {
          // Votar en (N) diseños
          campaignStatus.dyg.isBlocked = true;
          campaignStatus.dyg.unblockAt = new Date(Date.now() +
            timeUnit.hours.toMillis(item.missionCampaign.blockTime));
        }
        if (code === '0105') {
          // Tener (N) votos en uno de los diseños propios
          campaignStatus.dyg.isBlocked = true;
          campaignStatus.dyg.unblockAt = new Date(Date.now() +
            timeUnit.hours.toMillis(item.missionCampaign.blockTime));
        }
        if (code === '0201') {
          // Completar (N) preguntas
          campaignStatus.vdlg.isBlocked = true;
          campaignStatus.vdlg.unblockAt = new Date(Date.now() +
            timeUnit.hours.toMillis(item.missionCampaign.blockTime));
        }
        if (code === '0202') {
          // Predecir (N) preguntas
          campaignStatus.vdlg.isBlocked = true;
          campaignStatus.vdlg.unblockAt = new Date(Date.now() +
            timeUnit.hours.toMillis(item.missionCampaign.blockTime));
        }
        if (code === '0301') {
          // Alcanzar (N) puntos.
          campaignStatus.m3.isBlocked = true;
          campaignStatus.m3.unblockAt = new Date(Date.now() +
            timeUnit.hours.toMillis(item.missionCampaign.blockTime));
        }
        return item;
      });
      return [campaignStatus.save(), missionsCompleted];
    })
    .spread((campaignStatus, missionsCompleted) =>
      // Save all mission statuses
      Promise.map(missionsCompleted, missionCompleted =>
        MissionStatus.findOne({
          _id: missionCompleted.id,
        })
        .then(mission => {
          missionCompleted.value = missionCompleted.missionCampaign.max;
          missionCompleted.isDone = true;
          mission.set(missionCompleted);
          // return mission.save();
          return mission;
        })
      )
    )
    .then(missionsSaved => {
      const missionCampaigns = missionsSaved.map(item => item.missionCampaign);
      res.json(missionCampaigns);
    })
    .catch(next);
  },
};

export default StatusController;
