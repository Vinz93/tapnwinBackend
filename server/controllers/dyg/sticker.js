/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import fs from 'fs';
import path from 'path';

import Sticker from '../../models/dyg/sticker';

const StickerController = {
  readAll(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = req.query.criteria || {};

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

  readAllByCompany(req, res) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);
    const criteria = Object.assign(req.query.criteria || {}, {
      company: req.params.company_id,
    });

    Sticker.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(stickers => res.json(stickers))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    const data = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Sticker.create(data)
    .then(sticker => res.status(201).json(sticker))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Sticker.findById(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      res.json(sticker);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Sticker.findByIdAndUpdate(req.params.sticker_id, req.body, {
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
      if (err.name === 'CastError' || err.name === 'ValidationError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Sticker.findByIdAndRemove(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
        `/uploads${sticker.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },
};

export default StickerController;
