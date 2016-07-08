/**
 * @author Andres Alvarez
 * @description AssetQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import AssetQuestion from '../../models/vdlg/asset_question';

const AssetQuestionController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    AssetQuestion.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(questions => res.json(questions))
    .catch(next);
  },

  create(req, res, next) {
    AssetQuestion.create(req.body)
    .then(assetQuestion => res.status(201).json(assetQuestion))
    .catch(next);
  },
};

export default AssetQuestionController;
