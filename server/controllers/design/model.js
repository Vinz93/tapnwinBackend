/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Model from '../../models/design/model';

const ModelController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Model.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(models => res.json(models))
    .catch(err => res.status(500).send(err));
  },

  createByACampaign(req, res) {
    const criteria = Object.assign({ campaign: req.params.campaign_id }, req.body);

    Model.create(criteria)
    .then(model => res.status(201).json(model))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  readByACampaign(req, res) {
    const locals = req.app.locals;

    const campaign = req.params.campaign_id;
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Model.paginate({
      campaign,
    }, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(models => res.json(models))
    .catch(err => res.status(500).send(err));
  },

  read(req, res) {
    const criteria = {
      campaign: req.params.campaign_id,
      _id: req.params.model_id,
    };

    Model.findOne(criteria)
    .then(model => {
      if (!model)
        return res.status(404).end();
      res.json(model);
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
      _id: req.params.model_id,
    };

    Model.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(model => {
      if (!model)
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
      _id: req.params.model_id,
    };

    Model.findOneAndRemove(criteria)
    .then(model => {
      if (!model)
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

export default ModelController;