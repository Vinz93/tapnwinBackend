/**
 * @author Juan Sanchez
 * @description Status controller definition
 * @lastModifiedBy Juan Sanchez
 */

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
    const criteria = {
      player: res.locals.user.id,
      campaign: req.params.campaign_id,
    };

    CampaignStatus.findOne(criteria)
    .then(status => {
      res.json(status);
    })
    .catch(err => {
      if (err.id)
        return res.json(err);
      next(err);
    });
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
    const criteria = {
      _id: req.params.campaign_status_id,
      player: res.locals.user.id,
    };

    CampaignStatus.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(status => {
      if (!status)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },
};

export default StatusController;
