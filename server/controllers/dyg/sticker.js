/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import fs from 'fs';
import path from 'path';

import Sticker from '../../models/dyg/sticker';

const StickerController = {
  readAll(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Sticker.paginate(find, {
      sort,
      offset,
      limit,
      populate: ['campaign'],
    })
    .then(stickers => res.json(stickers))
    .catch(next);
  },

  readAllByCompany(req, res, next) {
    const locals = req.app.locals;
    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = Object.assign(req.query.find || {}, {
      company: req.params.company_id,
    });
    const sort = req.query.sort || { createdAt: 1 };

    Sticker.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(stickers => res.json(stickers))
    .catch(next);
  },

  create(req, res, next) {
    const data = Object.assign(req.body, {
      company: req.params.company_id,
    });

    Sticker.create(data)
    .then(sticker => res.status(201).json(sticker))
    .catch(next);
  },

  read(req, res, next) {
    Sticker.findById(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      res.json(sticker);
    })
    .catch(next);
  },

  update(req, res, next) {
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
    .catch(next);
  },

  delete(req, res, next) {
    Sticker.findByIdAndRemove(req.params.sticker_id)
    .then(sticker => {
      if (!sticker)
        return res.status(404).end();

      fs.unlinkSync(path.join(req.app.locals.config.root,
        `/uploads${sticker.url.split('uploads')[1]}`));

      res.status(204).end();
    })
    .catch(next);
  },
};

export default StickerController;
