/**
 * @author Andres Alvarez
 * @description StringQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import StringQuestion from '../../models/vdlg/stringQuestion';

const StringQuestionController = {
  createByCampaign(req, res, next) {
    const data = Object.assign(req.body, { campaign: req.params.campaign_id });

    StringQuestion.create(data)
    .then(stringQuestion => res.status(201).json(stringQuestion))
    .catch(next);
  },
};

export default StringQuestionController;
