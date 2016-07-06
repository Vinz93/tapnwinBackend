import express from 'express';

import Session from '../controllers/common/session';
import User from '../controllers/common/user';
import Question from '../controllers/vdlg/question';
import StringQuestion from '../controllers/vdlg/stringQuestion';
import AssetQuestion from '../controllers/vdlg/assetQuestion';
import Answer from '../controllers/vdlg/answer';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/questions', Question.readAll);
router.post('/string_questions', StringQuestion.create);
router.post('/asset_questions', AssetQuestion.create);
router.get('/players/me/questions', Session.validate, User.isPlayer, Question.readAllByMe);
router.get('/questions/:question_id', Question.read);
router.get('/questions/:question_id/statistics', Question.readStatistic);

router.get('/answers', Answer.readAll);
router.route('/players/me/answers')
.all(Session.validate, User.isPlayer)
.get(Answer.readAllByMe)
.post(Answer.createByMe);
router.get('/players/me/answers/statistics', Session.validate, User.isPlayer,
Answer.readStatisticByMe);
router.get('/answers/:answer_id', Answer.read);
router.patch('/players/me/answers/:answer_id', Session.validate, User.isPlayer, Answer.updateByMe);

export default router;
