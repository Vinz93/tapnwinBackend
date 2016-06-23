/**
 * @author Andres Alvarez
 * @description StringQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import StringQuestion from '../../models/voice/stringQuestion';

const StringQuestionController = {
  createByCampaign(req, res) {
    const data = Object.assign(req.body, { campaign: req.params.campaign_id });

    StringQuestion.create(data)
    .then(stringQuestion => res.status(201).json(stringQuestion))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err);

      res.status(500).send(err);
    });
  },
};

export default StringQuestionController;
