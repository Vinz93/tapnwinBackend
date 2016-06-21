/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Campaign from '../../models/common/campaign';

const CampaignController = {
  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = req.query.criteria || {};

    Campaign.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: [
        'company',
        'design.missions..mission',
        'design.models',
        'design.stickers',
        'design.categories.category',
        'design.categories.items',
      ],
    })
    .then(campaigns => res.json(campaigns))
    .catch(err => res.status(500).send(err));
  },

  createByCompany(req, res) {
    const criteria = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Campaign.create(criteria)
    .then(campaign => res.status(201).json(campaign))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  readAllByCompany(req, res) {
    const locals = req.app.locals;

    if (req.query.active === 'true') {
      Campaign.findActive()
      .populate('company')
      .populate('design.missions.mission')
      .populate('design.models')
      .populate('design.stickers')
      .populate('design.categories.category')
      .populate('design.categories.items')
      .then(campaign => {
        if (!campaign)
          return res.status(404).end();

        res.json(campaign);
      })
      .catch(err => {
        if (err.name === 'CastError')
          return res.status(400).send(err);

        return res.status(500).send(err);
      });
    } else {
      const company = req.params.company_id;
      const offset = locals.config.paginate.offset(req.query.offset);
      const limit = locals.config.paginate.limit(req.query.limit);

      Campaign.paginate({ company }, {
        sort: { createdAt: 1 },
        offset,
        limit,
        populate: [
          'company',
          'design.missions..mission',
          'design.models',
          'design.stickers',
          'design.categories.category',
          'design.categories.items',
        ],
      })
      .then(campaigns => res.json(campaigns))
      .catch(err => res.status(500).send(err));
    }
  },

  read(req, res) {
    Campaign.findById(req.params.campaign_id)
    .populate('company')
    .populate('design.missions..mission')
    .populate('design.models')
    .populate('design.stickers')
    .populate('design.categories.category')
    .populate('design.categories.items')
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();
      res.json(campaign);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Campaign.findByIdAndUpdate(req.params.campaign_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Campaign.findOneAndRemove(req.params.campaign_id)
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  validate(req, res, next) {
    Campaign.findById(req.params.campaign_id)
    .then(campaign => {
      if (!campaign)
        return res.status(404).json('Campaign not found');

      next();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },
};

export default CampaignController;
