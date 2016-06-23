/**
 * @author Andres Alvarez
 * @description MediaQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import MediaQuestion from '../../models/voice/mediaQuestion';

const MediaQuestionController = {
  createByCampaign(req, res) {
    const data = Object.assign(req.body, { campaign: req.params.campaign_id });

    MediaQuestion.create(data)
    .then(mediaQuestion => res.status(201).json(mediaQuestion))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
};

export default MediaQuestionController;
