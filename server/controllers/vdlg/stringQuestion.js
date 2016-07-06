/**
 * @author Andres Alvarez
 * @description StringQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import StringQuestion from '../../models/vdlg/stringQuestion';

const StringQuestionController = {
  create(req, res, next) {
    StringQuestion.create(req.body)
    .then(stringQuestion => res.status(201).json(stringQuestion))
    .catch(next);
  },
};

export default StringQuestionController;
