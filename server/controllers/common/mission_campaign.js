/**
 * @author Juan Sanchez
 * @description Mission-Campaign controller definition
 * @lastModifiedBy Juan Sanchez
 */

import MissionCampaign from '../../models/common/mission_campaign';

const MissionCampaignController = {
/**
 * @swagger
 * /api/v1/missions_campaigns:
 *   get:
 *     tags:
 *       - MissionsCampaigns
 *     description: Returns all missionsCampaings
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of missionsCampaings
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
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    MissionCampaign.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(missions => res.json(missions))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/missions_campaigns:
 *   post:
 *     tags:
 *       - MissionsCampaigns
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
    .then(mission => res.status(201).json(mission))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/missions_campaigns/{id}:
 *   get:
 *     tags:
 *       - MissionsCampaigns
 *     description: Returns a mission campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
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
    .then(mission => {
      if (!mission)
        return res.status(404).end();
      res.json(mission);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/missions_campaigns/{id}:
 *   patch:
 *     tags:
 *       - MissionsCampaigns
 *     description: Updates a missionCampaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
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
    .then(mission => {
      if (!mission)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/missions_campaigns/{id}:
 *   delete:
 *     tags:
 *       - MissionsCampaigns
 *     description: Deletes a missionCampaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: MissionCampaign's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    MissionCampaign.findByIdAndRemove(req.params.mission_campaign_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default MissionCampaignController;
