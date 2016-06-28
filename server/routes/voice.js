import express from 'express';

import Session from '../controllers/common/session';
import User from '../controllers/common/user';
import Question from '../controllers/voice/question';
import StringQuestion from '../controllers/voice/stringQuestion';
import MediaQuestion from '../controllers/voice/mediaQuestion';
import Answer from '../controllers/voice/answer';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/questions', Question.readAll);
router.get('/questions/:id', Question.read);
router.get('/campaigns/:campaign_id/questions', Question.readAllByCampaign);
router.get('/players/me/campaigns/:campaign_id/questions', Session.validate, User.isPlayer,
  Question.readAllByMeCampaign);
router.post('/campaigns/:campaign_id/string_questions', StringQuestion.createByCampaign);
router.post('/campaigns/:campaign_id/media_questions', MediaQuestion.createByCampaign);

router.get('/answers', Answer.readAll);
router.get('/answers/:id', Answer.read);
router.get('/players/me/campaigns/:campaign_id/answers', Session.validate, User.isPlayer,
  Answer.readAllByMeCampaign);
router.post('/players/me/questions/:question_id/answers', Session.validate, User.isPlayer,
  Answer.createByMeQuestion);
router.patch('/players/me/answers/:answer_id', Session.validate, User.isPlayer, Answer.updateByMe);

export default router;