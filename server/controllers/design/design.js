/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Design from '../../models/design/design';

const DesignController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Design.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(designs => res.json(designs))
    .catch(err => res.status(500).send(err));
  },

  createByACampaign(req, res) {
    const criteria = Object.assign({ campaign: req.params.campaign_id }, req.body);

    Design.create(criteria)
    .then(design => res.status(201).json(design))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  readByACampaign(req, res) {
    // TODO: Random read

    const locals = req.app.locals;

    const campaign = req.params.campaign_id;
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Design.paginate({
      campaign,
    }, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(designs => res.json(designs))
    .catch(err => res.status(500).send(err));
  },

  readByMeByACampaign(req, res) {
    const locals = req.app.locals;

    const campaign = req.params.campaign_id;
    const user = locals.user.id;
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Design.paginate({
      campaign,
      user,
    }, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(designs => res.json(designs))
    .catch(err => res.status(500).send(err));
  },

  read(req, res) {
    const criteria = {
      campaign: req.params.campaign_id,
      _id: req.params.design_id,
    };

    Design.findOne(criteria)
    .then(design => {
      if (!design)
        return res.status(404).end();
      res.json(design);
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
      campaign: req.params.campaign_id,
      _id: req.params.design_id,
    };

    Design.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(design => {
      if (!design)
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
      campaign: req.params.campaign_id,
      _id: req.params.design_id,
    };

    Design.findOneAndRemove(criteria)
    .then(design => {
      if (!design)
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

export default DesignController;
