/**
 * @author Juan Sanchez
 * @description Status controller definition
 * @lastModifiedBy Juan Sanchez
 */
import assignment from 'assignment';

import CampaignStatus from '../../models/common/campaign_status';

const StatusController = {
/**
 * @swagger
 * /api/v1/players/me/campaigns/{campaign_id}/campaign_status:
 *   get:
 *     tags:
 *       - CampaignStatuses
 *     description: Returns a campaignStatus
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
 * /api/v1/players/me/campaign_status/{campaign_status_id}:
 *   patch:
 *     tags:
 *       - CampaignStatuses
 *     description: Updates me
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Session-Token
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
        return res.status(404).end();

      assignment(campaignStatus, req.body);

      return campaignStatus.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
  },
};

export default StatusController;
