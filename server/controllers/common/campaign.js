/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Campaign from '../../models/common/campaign';

const CampaignController = {
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

  create(req, res, next) {
    Campaign.create(req.body)
    .then(campaign => res.status(201).json(campaign))
    .catch(next);
  },

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
