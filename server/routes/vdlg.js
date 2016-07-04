import express from 'express';

import Session from '../controllers/common/session';
import User from '../controllers/common/user';
import Question from '../controllers/vdlg/question';
import StringQuestion from '../controllers/vdlg/stringQuestion';
import AssetQuestion from '../controllers/vdlg/assetQuestion';
import Answer from '../controllers/vdlg/answer';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/questions', Question.readAll);
router.get('/campaigns/:campaign_id/questions', Question.readAllByCampaign);
router.get('/players/me/campaigns/:campaign_id/questions', Session.validate, User.isPlayer,
  Question.readAllByMeCampaign);
router.get('/questions/:question_id', Question.read);
router.get('/questions/:question_id/statistics', Question.readStatistic);
router.post('/campaigns/:campaign_id/string_questions', StringQuestion.createByCampaign);
router.post('/campaigns/:campaign_id/asset_questions', AssetQuestion.createByCampaign);

router.get('/answers', Answer.readAll);
router.get('/answers/:answer_id', Answer.read);
router.get('/players/me/campaigns/:campaign_id/answers', Session.validate, User.isPlayer,
  Answer.readAllByMeCampaign);
router.get('/players/me/campaigns/:campaign_id/answers/statistics', Session.validate, User.isPlayer,
  Answer.readStatisticByMeCampaign);
router.post('/players/me/questions/:question_id/answers', Session.validate, User.isPlayer,
  Answer.createByMeQuestion);
router.patch('/players/me/answers/:answer_id', Session.validate, User.isPlayer, Answer.updateByMe);

export default router;
