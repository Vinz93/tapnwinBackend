/**
 * @author Juan Sanchez
 * @description Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../../helpers/api_error';
import CampaignStatus from '../../models/common/campaign_status';

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
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },
};

export default StatusController;
