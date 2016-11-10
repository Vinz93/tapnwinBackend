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
 * /players/me/trade_balance/{campaign_status_id}:
 *   put:
 *     tags:
 *       - CampaignStatuses
 *     description: Trade the user's balance if they have it unblocked
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
 *     responses:
 *       200:
 *         description: Successfully trade
 */
  tradeBalance(req, res, next) {
    let balance = undefined;
    CampaignStatus.findOne({
      player: res.locals.user._id,
      _id: req.params.campaign_status_id,
    })
    .then(campaignStatus => {
      if (!campaignStatus)
        return Promise.reject(new APIError('CampaignStatus not found', httpStatus.NOT_FOUND));
      if (campaignStatus.balance > 0 && campaignStatus.isBlocked == false) {
        balance = campaignStatus.balance;
        campaignStatus.balance = 0;
        return campaignStatus.save();
      }
      return Promise.reject(new APIError('The balance is 0 or blocked',
          httpStatus.NOT_ACCEPTABLE));
    })
    .then(() => {
      res.status(httpStatus.OK).json({ balanceRemoved: balance });
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
          player: res.locals.user._id,
          missionCampaign: missionCampaign._id,
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
              player: res.locals.user._id,
              missionCampaign: missionCampaign._id,
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
      let blocked = false;
      const missionsCompleted = [];
      const missionsUpdated = missionStatuses.map(item => {
        const code = item.missionCampaign.mission.code;
        if (code === '0101' && !item.isDone) {
          // Hacer (N) diseños
          if (campaignStatus.dyg.dressed >= item.missionCampaign.max) {
            // Mission Completed
            if (item.missionCampaign.isBlocking) {
              const blockTime = new Date(Date.now() +
                timeUnit.hours.toMillis(item.missionCampaign.blockTime));
              if (campaignStatus.campaign.m3.blockable) {
                campaignStatus.m3.isBlocked = true;
                campaignStatus.m3.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.dyg.blockable) {
                campaignStatus.dyg.isBlocked = true;
                campaignStatus.dyg.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.vdlg.blockable) {
                campaignStatus.vdlg.isBlocked = true;
                campaignStatus.vdlg.unblockAt = blockTime;
              }
            }
            item.value = item.missionCampaign.max;
            item.isDone = true;
            missionsCompleted.push(item);
          } else {
            // Mission updated
            item.value = campaignStatus.dyg.dressed;
          }
        }
        if (code === '0104' && !item.isDone) {
          // Votar en (N) diseños
          if (campaignStatus.dyg.votesGiven >= item.missionCampaign.max) {
            // Mission Completed
            if (item.missionCampaign.isBlocking) {
              const blockTime = new Date(Date.now() +
                timeUnit.hours.toMillis(item.missionCampaign.blockTime));
              if (campaignStatus.campaign.m3.blockable) {
                campaignStatus.m3.isBlocked = true;
                campaignStatus.m3.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.dyg.blockable) {
                campaignStatus.dyg.isBlocked = true;
                campaignStatus.dyg.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.vdlg.blockable) {
                campaignStatus.vdlg.isBlocked = true;
                campaignStatus.vdlg.unblockAt = blockTime;
              }
            }
            item.value = item.missionCampaign.max;
            item.isDone = true;
            missionsCompleted.push(item);
          } else {
            // Mission updated
            item.value = campaignStatus.dyg.votesGiven;
          }
        }
        if (code === '0105' && !item.isDone) {
          // Tener (N) votos en uno de los diseños propios
          if (campaignStatus.dyg.votesReceived >= item.missionCampaign.max) {
            // Mission Completed
            if (item.missionCampaign.isBlocking) {
              const blockTime = new Date(Date.now() +
                timeUnit.hours.toMillis(item.missionCampaign.blockTime));
              if (campaignStatus.campaign.m3.blockable) {
                campaignStatus.m3.isBlocked = true;
                campaignStatus.m3.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.dyg.blockable) {
                campaignStatus.dyg.isBlocked = true;
                campaignStatus.dyg.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.vdlg.blockable) {
                campaignStatus.vdlg.isBlocked = true;
                campaignStatus.vdlg.unblockAt = blockTime;
              }
            }
            item.value = item.missionCampaign.max;
            item.isDone = true;
            missionsCompleted.push(item);
          } else {
            // Mission updated
            item.value = campaignStatus.dyg.votesReceived;
          }
        }
        if (code === '0201' && !item.isDone) {
          // Completar (N) preguntas
          if (campaignStatus.vdlg.answered >= item.missionCampaign.max) {
            // Mission Completed
            if (item.missionCampaign.isBlocking) {
              const blockTime = new Date(Date.now() +
                timeUnit.hours.toMillis(item.missionCampaign.blockTime));
              if (campaignStatus.campaign.m3.blockable) {
                campaignStatus.m3.isBlocked = true;
                campaignStatus.m3.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.dyg.blockable) {
                campaignStatus.dyg.isBlocked = true;
                campaignStatus.dyg.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.vdlg.blockable) {
                campaignStatus.vdlg.isBlocked = true;
                campaignStatus.vdlg.unblockAt = blockTime;
              }
            }
            item.value = item.missionCampaign.max;
            item.isDone = true;
            missionsCompleted.push(item);
          } else {
            // Mission updated
            item.value = campaignStatus.vdlg.answered;
          }
        }
        if (code === '0202' && !item.isDone) {
          // Predecir (N) preguntas
          if (campaignStatus.vdlg.correct >= item.missionCampaign.max) {
            // Mission Completed
            if (item.missionCampaign.isBlocking) {
              const blockTime = new Date(Date.now() +
                timeUnit.hours.toMillis(item.missionCampaign.blockTime));
              if (campaignStatus.campaign.m3.blockable) {
                campaignStatus.m3.isBlocked = true;
                campaignStatus.m3.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.dyg.blockable) {
                campaignStatus.dyg.isBlocked = true;
                campaignStatus.dyg.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.vdlg.blockable) {
                campaignStatus.vdlg.isBlocked = true;
                campaignStatus.vdlg.unblockAt = blockTime;
              }
            }
            item.value = item.missionCampaign.max;
            item.isDone = true;
            missionsCompleted.push(item);
          } else {
            // Mission updated
            item.value = campaignStatus.vdlg.correct;
          }
        }
        if (code === '0301' && !item.isDone) {
          // Alcanzar (N) puntos.
          if (campaignStatus.m3.score >= item.missionCampaign.max) {
            // Mission Completed
            if (item.missionCampaign.isBlocking) {
              const blockTime = new Date(Date.now() +
                timeUnit.hours.toMillis(item.missionCampaign.blockTime));
              if (campaignStatus.campaign.m3.blockable) {
                campaignStatus.m3.isBlocked = true;
                campaignStatus.m3.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.dyg.blockable) {
                campaignStatus.dyg.isBlocked = true;
                campaignStatus.dyg.unblockAt = blockTime;
              }
              if (campaignStatus.campaign.vdlg.blockable) {
                campaignStatus.vdlg.isBlocked = true;
                campaignStatus.vdlg.unblockAt = blockTime;
              }
            }
            item.value = item.missionCampaign.max;
            item.isDone = true;
            missionsCompleted.push(item);
          } else {
            // Mission updated
            item.value = campaignStatus.m3.score;
          }
        }
        if (!item.isDone && item.missionCampaign.isRequired) {
          blocked = true;
        }
        return item;
      });

      campaignStatus.isBlocked = blocked;

      return [campaignStatus.save(), missionsUpdated, missionsCompleted];
    })
    .spread((campaignStatus, missionsUpdated, missionsCompleted) =>
      // Save all mission statuses
      [Promise.map(missionsUpdated, missionUpdated =>
        MissionStatus.findOne({
          _id: missionUpdated._id,
        })
        .then(mission => {
          mission.set(missionUpdated);
          return mission.save();
        })
      ),
      missionsCompleted,
    ]
    )
    .spread((missionsSaved, missionsCompleted) =>
      Promise.map(missionsCompleted, missionCompleted =>
        MissionStatus.findOne({
          _id: missionCompleted._id,
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
        }))
      )
    )
    .then(missionsCompleted => {
      res.json(missionsCompleted.map(item => item.missionCampaign));
    })
    .catch(next);
  },
/**
 * @swagger
 * /players/me/campaign_statuses/{campaign_status_id}/unlock_games:
 *   patch:
 *     tags:
 *       - CampaignStatuses
 *     description: Unlock games
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
 *     responses:
 *       204:
 *         description: Successfully unlocked games
 */
  unlockGames(req, res, next) {
    CampaignStatus.findOne({
      player: res.locals.user._id,
      _id: req.params.campaign_status_id,
    })
    .then(campaignStatus => {
      campaignStatus.vdlg.isBlocked = false;
      campaignStatus.vdlg.unblockAt = undefined;
      campaignStatus.dyg.isBlocked = false;
      campaignStatus.dyg.unblockAt = undefined;
      campaignStatus.m3.isBlocked = false;
      campaignStatus.m3.unblockAt = undefined;
      return campaignStatus.save();
    })
    .then(campaignStatus => {
      if (!campaignStatus)
        return Promise.reject(new APIError('CampaignStatus not found', httpStatus.NOT_FOUND));

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },
};

export default StatusController;
