/**
 * @author Andres Alvarez
 * @description StringQuestion controller definition
 * @lastModifiedBy Andres Alvarez
 */

import StringQuestion from '../../models/vdlg/string_question';

const StringQuestionController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    StringQuestion.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(questions => res.json(questions))
    .catch(next);
  },

  create(req, res, next) {
    StringQuestion.create(req.body)
    .then(stringQuestion => res.status(201).json(stringQuestion))
    .catch(next);
  },
};

export default StringQuestionController;
