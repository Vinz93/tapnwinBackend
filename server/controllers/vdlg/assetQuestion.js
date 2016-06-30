/**
 * @author Andres Alvarez
 * @description AssetQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import AssetQuestion from '../../models/vdlg/assetQuestion';

const AssetQuestionController = {
  createByCampaign(req, res) {
    const data = Object.assign(req.body, { campaign: req.params.campaign_id });

    AssetQuestion.create(data)
    .then(assetQuestion => res.status(201).json(assetQuestion))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
};

export default AssetQuestionController;
