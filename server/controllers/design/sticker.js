/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Sticker from '../../models/design/sticker';
import fs from 'fs';
import path from 'path';

const StickerController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Sticker.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
      populate: ['campaign'],
    })
    .then(stickers => res.json(stickers))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const criteria = Object.assign({ campaign: req.params.campaign_id }, req.body);

    Sticker.create(criteria)
    .then(sticker => res.status(201).json(sticker))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  readAllByCompany(req, res) {
    const locals = req.app.locals;

    const campaign = req.params.campaign_id;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    Sticker.paginate({
      campaign,
    }, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(stickers => res.json(stickers))
    .catch(err => res.status(500).send(err));
  },

  read(req, res) {
    const criteria = {
      campaign: req.params.campaign_id,
      _id: req.params.sticker_id,
    };

    Sticker.findOne(criteria)
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();
      res.json(sticker);
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
      _id: req.params.sticker_id,
    };

    Sticker.findOneAndUpdate(criteria, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${sticker.url.split('uploads')[1]}`));

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
      _id: req.params.sticker_id,
    };

    Sticker.findOneAndRemove(criteria)
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
      `/uploads${sticker.url.split('uploads')[1]}`));

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

export default StickerController;
