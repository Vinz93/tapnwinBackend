/**
 * @author Andres Alvarez
 * @description AssetQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import AssetQuestion from '../../models/vdlg/asset_question';

const AssetQuestionController = {
  create(req, res, next) {
    AssetQuestion.create(req.body)
    .then(assetQuestion => res.status(201).json(assetQuestion))
    .catch(next);
  },
};

export default AssetQuestionController;
