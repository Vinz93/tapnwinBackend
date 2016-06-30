/**
 * @author Andres Alvarez
 * @description MediaQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import MediaQuestion from '../../models/vdlg/mediaQuestion';

const MediaQuestionController = {
  createByCampaign(req, res, next) {
    const data = Object.assign(req.body, { campaign: req.params.campaign_id });

    MediaQuestion.create(data)
    .then(mediaQuestion => res.status(201).json(mediaQuestion))
    .catch(next);
  },
};

export default MediaQuestionController;
