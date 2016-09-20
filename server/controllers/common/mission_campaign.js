/**
 * @author Juan Sanchez
 * @description Mission-Campaign controller definition
 * @lastModifiedBy Juan Sanchez
 */
import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import MissionCampaign from '../../models/common/mission_campaign';

const MissionCampaignController = {
/**
 * @swagger
 * /mission_campaigns:
 *   get:
 *     tags:
 *       - MissionCampaigns
 *     description: Returns all missionCampaings
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
 *         description: An array of missionCampaings
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/MissionCampaign'
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

    MissionCampaign.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['mission'],
    })
    .then(missions => res.json(missions))
    .catch(next);
  },

/**
 * @swagger
 * /mission_campaigns:
 *   post:
 *     tags:
 *       - MissionCampaigns
 *     description: Creates a missionCampaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: missionCampaign
 *         description: missionCampaign object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MissionCampaign'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/MissionCampaign'
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
  create(req, res, next) {
    MissionCampaign.create(req.body)
    .then(mission => MissionCampaign.populate(mission, 'mission'))
    .then(mission => res.status(httpStatus.CREATED).json(mission))
    .catch(next);
  },

/**
 * @swagger
 * /mission_campaigns/{mission_campaign_id}:
 *   get:
 *     tags:
 *       - MissionCampaigns
 *     description: Returns a mission campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission_campaign_id
 *         description: MissionCampaign's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A missionCampaign
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/MissionCampaign'
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
    MissionCampaign.findById(req.params.mission_campaign_id)
    .populate('mission')
    .then(mission => {
      if (!mission)
        return Promise.reject(new APIError('MissionCampaign not found', httpStatus.NOT_FOUND));

      res.json(mission);
    })
    .catch(next);
  },

/**
 * @swagger
 * /mission_campaigns/{mission_campaign_id}:
 *   patch:
 *     tags:
 *       - MissionCampaigns
 *     description: Updates a missionCampaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission_campaign_id
 *         description: missionCampaign's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: missionCampaign
 *         description: MissionCampaign object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MissionCampaign'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    MissionCampaign.findByIdAndUpdate(req.params.mission_campaign_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .populate('mission')
    .then(mission => {
      if (!mission)
        return Promise.reject(new APIError('MissionCampaign not found', httpStatus.NOT_FOUND));

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /mission_campaigns/{mission_campaign_id}:
 *   delete:
 *     tags:
 *       - MissionCampaigns
 *     description: Deletes a missionCampaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mission_campaign_id
 *         description: MissionCampaign's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    MissionCampaign.findById(req.params.mission_campaign_id)
    .then(missionCampaign => {
      if (!missionCampaign)
        return Promise.reject(new APIError('MissionCampaign not found', httpStatus.NOT_FOUND));

      return missionCampaign.remove();
    })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },
};

export default MissionCampaignController;
