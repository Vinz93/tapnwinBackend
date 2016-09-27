/**
 * @author Andres Alvarez
 * @description Vote controller definition
 * @lastModifiedBy Carlos Avilan
 */
import httpStatus from 'http-status';
import timeUnit from 'time-unit';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Design from '../../models/dyg/design';
import Vote from '../../models/dyg/vote';
import MissionStatus from '../../models/common/mission_status';
import MissionCampaign from '../../models/common/mission_campaign';
import CampaignStatus from '../../models/common/campaign_status';

const VoteController = {
/**
 * @swagger
 * /votes:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns all votes
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: limit
 *         description: Return limit
 *         in: query
 *         required: false
 *         type: integer
 *       - name: offset
 *         description: Return offset
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of votes
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Vote'
 *                   - properties:
 *                       id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *             total:
 *               type: integer
 *             limit:
 *               type: integer
 *             offset:
 *               type: integer
 */
  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Vote.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(votes => res.json(votes))
    .catch(next);
  },

/**
 * @swagger
 * /players/me/votes:
 *   post:
 *     tags:
 *       - Votes
 *     description: Creates a player's vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: vote
 *         description: Vote object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Vote'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Vote'
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
  createByMe(req, res, next) {
    req.body.player = res.locals.user._id;

    Vote.create(req.body)
    .then(vote => [
      vote,
      Vote.populate(vote, 'design'),
    ])
    .spread((vote, votePopulated) => [
      vote,
      votePopulated,
      CampaignStatus.findOrCreate({
        player: votePopulated.design.player,
        campaign: votePopulated.design.campaign,
      }),
    ])
    .spread((vote, votePopulated, campaignStatus) => [
      vote,
      votePopulated,
      CampaignStatus.populate(campaignStatus, 'campaign'),
    ])
    .spread((vote, votePopulated, campaignStatus) => [
      vote,
      votePopulated,
      campaignStatus,
      MissionCampaign.find({
        campaign: campaignStatus.campaign._id,
      }),
    ])
    .spread((vote, votePopulated, campaignStatus, missionCampaigns) => [
      vote,
      votePopulated,
      campaignStatus,
      Promise.map(missionCampaigns, missionCampaign =>
        MissionStatus.findOne({
          player: votePopulated.design.player,
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
              player: votePopulated.design.player,
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
    .spread((vote, votePopulated, campaignStatus, missionStatuses) => [
      vote,
      votePopulated,
      campaignStatus,
      missionStatuses,
      Vote.aggregate([
        {
          $group: {
            _id: {
              design: '$design',
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: 1 } },
      ], (err, votes) =>
        Design.find({ _id: { $in: votes.map(item => item._id.design) } })
        .then(designs => {
          const designsVoted = designs.map((item, index) => {
            const designAndCount = {};
            designAndCount.count = votes[index].count;
            designAndCount.design = item;
            // console.log(designAndCount);
            return designAndCount;
          })
          .filter(item =>
            item.design.player.toString() === votePopulated.design.player.toString()
          );
          return designsVoted.reduce((prev, item) =>
            Math.max(prev, item.count), 0);
        })
        .then(votes => {
          campaignStatus.dyg.votesReceived = votes;
          return campaignStatus.save();
        })
        .then(campaignStatus => {
          let blocked = false;
          const missionsUpdated = missionStatuses.map(item => {
            const code = item.missionCampaign.mission.code;
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
              } else {
                // Mission updated
                item.value = campaignStatus.dyg.votesReceived;
              }
            }
            if (!item.isDone && item.missionCampaign.isRequired) {
              blocked = true;
            }
            return item;
          });

          campaignStatus.isBlocked = blocked;
          // console.log(campaignStatus);
          return [campaignStatus.save(), missionsUpdated];
        })
        .spread((campaignStatus, missionsUpdated) =>
          Promise.map(missionsUpdated, missionUpdated =>
            MissionStatus.findOne({
              _id: missionUpdated._id,
            })
            .then(mission => {
              mission.set(missionUpdated);
              return mission.save();
            })
          )
        )
        .then(() => res.status(httpStatus.CREATED).json(vote))
      ),
    ])
    .catch(next);
  },

/**
 * @swagger
 * /votes/{vote_id}:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns a vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: vote_id
 *         description: Vote's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A vote
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Vote'
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
  read(req, res, next) {
    Vote.findById(req.params.vote_id)
    .then(vote => {
      if (!vote)
        return Promise.reject(new APIError('Vote not found', httpStatus.NOT_FOUND));

      res.json(vote);
    })
    .catch(next);
  },

/**
 * @swagger
 * /players/me/designs/{design_id}/vote:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns a vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: design_id
 *         description: Design's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A vote
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Vote'
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
  readByMeDesign(req, res, next) {
    Vote.findOne({
      design: req.params.design_id,
      player: res.locals.user._id,
    })
    .then(vote => {
      if (!vote)
        return Promise.reject(new APIError('Vote not found', httpStatus.NOT_FOUND));

      res.json(vote);
    })
    .catch(next);
  },

/**
 * @swagger
 * /designs/{design_id}/votes/statistics:
 *   get:
 *     tags:
 *       - Votes
 *     description: Returns design's statistics
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: design_id
 *         description: Design's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A vote
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               sticker:
 *                 type: string
 *               count:
 *                 type: integer
 */
  readStatisticByDesign(req, res, next) {
    Design.findById(req.params.design_id)
    .populate('campaign')
    .then(design => {
      if (!design)
        return Promise.reject(new APIError('Design not found', httpStatus.NOT_FOUND));

      return Promise.map(design.campaign.dyg.stickers, sticker => Vote.count({
        design: design._id,
        stickers: sticker,
      })
      .then(count => {
        const data = {
          sticker,
          count,
        };

        return data;
      }));
    })
    .then(data => res.send(data))
    .catch(next);
  },

/**
 * @swagger
 * /players/me/votes/{vote_id}:
 *   patch:
 *     tags:
 *       - Votes
 *     description: Updates a player's vote
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: X-Auth-Token
 *         description: Player's session token
 *         in: header
 *         required: true
 *         type: string
 *       - name: vote_id
 *         description: Vote's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: vote
 *         description: Vote object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Vote'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  updateByMe(req, res, next) {
    Vote.findOne({
      _id: req.params.vote_id,
      player: res.locals.user._id,
    })
    .then(vote => {
      if (!vote)
        return Promise.reject(new APIError('Vote not found', httpStatus.NOT_FOUND));

      vote.set(req.body);

      return vote.save();
    })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },
};

export default VoteController;
