import express from 'express';

import Session from '../controllers/common/session';
import User from '../controllers/common/user';
import Question from '../controllers/vdlg/question';
import StringQuestion from '../controllers/vdlg/string_question';
import AssetQuestion from '../controllers/vdlg/asset_question';
import Answer from '../controllers/vdlg/answer';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/questions')
.get(Question.readAll);

router.route('/string_questions')
.get(StringQuestion.readAll)
.post(StringQuestion.create);

router.route('/asset_questions')
.get(AssetQuestion.readAll)
.post(AssetQuestion.create);

router.route('/players/me/questions')
.all(Session.validate, User.isPlayer)
.get(Question.readAllByMe);

router.route('/questions/:question_id')
.get(Question.read);

router.route('/questions/:question_id/statistics')
.get(Question.readStatistic);

router.get('/answers', Answer.readAll);

router.route('/players/me/answers')
.all(Session.validate, User.isPlayer)
.get(Answer.readAllByMe)
.post(Answer.createByMe);

router.route('/players/me/answers/statistics')
.all(Session.validate, User.isPlayer)
.get(Answer.readStatisticByMe);

router.route('/answers/:answer_id')
.get(Answer.read);

router.route('/players/me/answers/:answer_id')
.patch(Session.validate, User.isPlayer, Answer.updateByMe);

export default router;
