/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Campaign from '../../models/common/campaign';

const CampaignController = {
/**
 * @swagger
 * /api/v1/campaigns:
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
 *       - name: active
 *         description: True for filter by active campaign and false otherwise
 *         in: query
 *         required: true
 *         type: boolean
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
    if (req.query.active === 'true') {
      Campaign.findActive()
      .populate('company')
      .populate('dyg.models')
      .populate('dyg.stickers')
      .populate('dyg.categories.category')
      .populate('dyg.categories.items')
      .then(campaign => {
        if (!campaign)
          return res.status(404).end();

        res.json(campaign);
      })
      .catch(next);
    } else {
      const locals = req.app.locals;

      const offset = locals.config.paginate.offset(req.query.offset);
      const limit = locals.config.paginate.limit(req.query.limit);

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
          'dyg.categories.category',
          'dyg.categories.items',
        ],
      })
      .then(campaigns => res.json(campaigns))
      .catch(next);
    }
  },

/**
 * @swagger
 * /api/v1/campaigns:
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
    .then(campaign => res.status(201).json(campaign))
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/campaigns/{campaign_id}:
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
    .populate('dyg.categories.category')
    .populate('dyg.categories.items')
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();

      res.json(campaign);
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/campaigns/{campaign_id}:
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
    Campaign.findByIdAndUpdate(req.params.campaign_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /api/v1/campaigns/{campaign_id}:
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
    Campaign.findOneAndRemove(req.params.campaign_id)
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },

  validate(req, res, next) {
    Campaign.findById(req.params.campaign_id)
    .then(campaign => {
      if (!campaign)
        return res.status(404).json('Campaign not found');

      res.locals.campaign = campaign;

      next();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  designActive(req, res, next) {
    if (!res.locals.campaign.dyg.active)
      return res.status(409).json('DYG game is not active');

    next();
  },

  voiceActive(req, res, next) {
    if (!res.locals.campaign.vdlg.active)
      return res.status(409).json('VDLG game is not active');

    next();
  },

  match3Active(req, res, next) {
    if (!res.locals.campaign.m3.active)
      return res.status(409).json('M3 game is not active');

    next();
  },

  ownerActive(req, res, next) {
    if (!res.locals.campaign.ddt.active)
      return res.status(409).json('DDT game is not active');

    next();
  },
};

export default CampaignController;
