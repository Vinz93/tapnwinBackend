import express from 'express';
import validate from 'express-validation';

import questionValidator from '../../config/param_validations/vdlg/question';
import stringQuestionValidator from '../../config/param_validations/vdlg/string_question';
import assetQuestionValidator from '../../config/param_validations/vdlg/asset_question';
import answerValidator from '../../config/param_validations/vdlg/answer';
import possibilityAssetValidator from '../../config/param_validations/vdlg/possibility_asset';
import User from '../controllers/common/user';
import Session from '../controllers/common/session';
import Question from '../controllers/vdlg/question';
import StringQuestion from '../controllers/vdlg/string_question';
import AssetQuestion from '../controllers/vdlg/asset_question';
import Answer from '../controllers/vdlg/answer';
import PossibilityAsset from '../controllers/vdlg/possibility_asset';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/questions')
.get(validate(questionValidator.readAll), Question.readAll);

router.route('/string_questions')
.post(validate(stringQuestionValidator.create), StringQuestion.create);

router.route('/asset_questions')
.post(validate(assetQuestionValidator.create), AssetQuestion.create);

router.route('/possibility_assets')
.post(validate(possibilityAssetValidator.create), PossibilityAsset.create);

router.route('/players/me/questions')
.get(validate(questionValidator.readAllByMe), Session.validate, User.isPlayer,
Question.readAllByMe);

router.route('/questions/:question_id')
.get(validate(questionValidator.read), Question.read);

router.route('/questions/:question_id/statistics')
.get(validate(questionValidator.readStatistic), Question.readStatistic);

router.route('/answers')
.get(validate(questionValidator.readAll), Answer.readAll);

router.route('/players/me/answers')
.get(validate(answerValidator.readAllByMe), Session.validate, User.isPlayer, Answer.readAllByMe)
.post(validate(answerValidator.createByMe), Session.validate, User.isPlayer, Answer.createByMe);

router.route('/players/me/answers/statistics')
.get(validate(answerValidator.readStatisticByMe), Session.validate, User.isPlayer,
Answer.readStatisticByMe);

router.route('/answers/:answer_id')
.get(validate(answerValidator.read), Answer.read);

router.route('/players/me/answers/:answer_id')
.patch(validate(answerValidator.updateByMe), Session.validate, User.isPlayer, Answer.updateByMe);

export default router;
