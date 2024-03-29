/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */
import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Campaign from '../../models/common/campaign';

const CampaignController = {
/**
 * @swagger
 * /campaigns:
 *   get:
 *     tags:
 *       - Campaigns
 *     description: Returns all missions
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
 *         description: An array of campaigns
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Campaign'
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

    Campaign.paginate(find, {
      sort,
      offset,
      limit,
      populate: [
        'company',
        'dyg.models',
        'dyg.stickers',
        'dyg.catalog.category',
        'dyg.catalog.items',
      ],
    })
    .then(campaigns => res.json(campaigns))
    .catch(next);
  },

/**
 * @swagger
 * /campaigns:
 *   post:
 *     tags:
 *       - Campaigns
 *     description: Creates a campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: campaign
 *         description: Campaign object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Campaign'
 *     responses:
 *       200:
 *         description: Successfully created
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Campaign'
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
    Campaign.create(req.body)
    .then(campaign => res.status(httpStatus.CREATED).json(campaign))
    .catch(next);
  },

/**
 * @swagger
 * /campaigns/{campaign_id}:
 *   get:
 *     tags:
 *       - Campaigns
 *     description: Returns a campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: campaign_id
 *         description: Campaign's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A campaign
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Campaign'
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
    Campaign.findById(req.params.campaign_id)
    .populate('company')
    .populate('dyg.models')
    .populate('dyg.stickers')
    .populate('dyg.catalog.category')
    .populate('dyg.catalog.items')
    .then(campaign => {
      if (!campaign)
        return Promise.reject(new APIError('Campaign not found', httpStatus.NOT_FOUND));

      res.json(campaign);
    })
    .catch(next);
  },

  /**
   * @swagger
   * /companies/{company_id}/campaign:
   *   get:
   *     tags:
   *       - Campaigns
   *     description: Returns the active campaign of a company
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: company_id
   *         description: Company's id
   *         in: path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: A campaign
   *         schema:
   *           allOf:
   *              - $ref: '#/definitions/Campaign'
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
  readByCompany(req, res, next) {
    Campaign.findOneActive({ company: req.params.company_id })
    .populate('dyg.models')
    .populate('dyg.stickers')
    .populate('dyg.catalog.category')
    .populate('dyg.catalog.items')
    .then(campaign => {
      if (!campaign)
        return Promise.reject(new APIError('Campaign not found', httpStatus.NOT_FOUND));

      res.json(campaign);
    })
    .catch(next);
  },

/**
 * @swagger
 * /campaigns/{campaign_id}:
 *   patch:
 *     tags:
 *       - Campaigns
 *     description: Updates a campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: campaign_id
 *         description: Campaign's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: campaign
 *         description: Campaign object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Campaign'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    Campaign.findById(req.params.campaign_id)
    .then(campaign => {
      if (!campaign)
        return Promise.reject(new APIError('Campaign not found', httpStatus.NOT_FOUND));

      if (campaign.isActive())
        return Promise.reject(new APIError('Active campaign', httpStatus.BAD_REQUEST));

      campaign.set(req.body);

      return campaign.save();
    })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },

/**
 * @swagger
 * /campaigns/{campaign_id}:
 *   delete:
 *     tags:
 *       - Campaigns
 *     description: Deletes a campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: campaign_id
 *         description: Campaign's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Campaign.findById(req.params.campaign_id)
    .then(campaign => {
      if (!campaign)
        return Promise.reject(new APIError('Campaign not found', httpStatus.NOT_FOUND));

      return campaign.remove();
    })
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(next);
  },
};

export default CampaignController;
