/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Campaign from '../../models/common/campaign';

const CampaignController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Campaign.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['company', 'games.game', 'games.missions.mission'],
    })
    .then(campaigns => res.json(campaigns))
    .catch(err => res.status(500).send(err));
  },

  createByACompany(req, res) {
    const criteria = Object.assign({ company: req.params.company_id }, req.body);

    Campaign.create(criteria)
    .then(campaign => res.status(201).json(campaign))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  readByACompany(req, res) {
    const locals = req.app.locals;

    if (req.query.active === 'true') {
      const today = new Date();

      Campaign.findOne({ startAt: { $lt: today }, finishAt: { $gte: today } })
      .populate('company games.game games.missions.mission')
      .then(campaign => {
        if (!campaign)
          return res.status(404).end();
        res.json(campaign);
      })
      .catch(err => {
        if (err.name === 'CastError') {
          return res.status(400).send(err);
        }
        return res.status(500).send(err);
      });
    } else {
      const company = req.params.company_id;
      const offset = locals.config.offset(req.query.offset);
      const limit = locals.config.limit(req.query.limit);

      Campaign.paginate({
        company,
      }, {
        sort: {
          createdAt: 1,
        },
        offset,
        limit,
        populate: ['company', 'games.game', 'games.missions.mission'],
      })
      .then(campaigns => res.json(campaigns))
      .catch(err => res.status(500).send(err));
    }
  },

  read(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.campaign_id,
    };

    Campaign.findOne(criteria)
    .populate('company games.game games.missions.mission')
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();
      res.json(campaign);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.campaign_id,
    };

    Campaign.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    const criteria = {
      company: req.params.company_id,
      _id: req.params.campaign_id,
    };

    Campaign.findOneAndRemove(criteria)
    .then(campaign => {
      if (!campaign)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },
};

export default CampaignController;