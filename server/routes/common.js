import express from 'express';
import validate from 'express-validation';

import userValidator from '../../config/param_validations/common/user';
import administratorValidator from '../../config/param_validations/common/administrator';
import playerValidator from '../../config/param_validations/common/player';
import sessionValidator from '../../config/param_validations/common/session';
import companyValidator from '../../config/param_validations/common/company';
import assetValidator from '../../config/param_validations/common/asset';
import gameAssetValidator from '../../config/param_validations/common/game_asset';
import campaignValidator from '../../config/param_validations/common/campaign';
import missionValidator from '../../config/param_validations/common/mission';
import missionCampaignValidator from '../../config/param_validations/common/mission_campaign';
import campaignStatusValidator from '../../config/param_validations/common/campaign_status';
import missionStatusValidator from '../../config/param_validations/common/mission_status';
import User from '../controllers/common/user';
import Administrator from '../controllers/common/administrator';
import Player from '../controllers/common/player';
import Session from '../controllers/common/session';
import Company from '../controllers/common/company';
import Asset from '../controllers/common/asset';
import GameAsset from '../controllers/common/game_asset';
import Campaign from '../controllers/common/campaign';
import Mission from '../controllers/common/mission';
import MissionCampaign from '../controllers/common/mission_campaign';
import CampaignStatus from '../controllers/common/campaign_status';
import MissionStatus from '../controllers/common/mission_status';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/users')
.get(User.readAll);

router.route('/users/recovery_token')
.post(validate(userValidator.createRecoveryToken), User.createRecoveryToken);

router.route('/users/password')
.put(validate(userValidator.updatePassword), User.updatePassword);

router.route('/users/me')
.get(validate(userValidator.readByMe), Session.validate, User.readByMe)
.patch(validate(userValidator.updateByMe), Session.validate, User.updateByMe);

router.route('/users/:user_id')
.get(validate(userValidator.read), User.read)
.patch(validate(userValidator.update), User.update)
.delete(validate(userValidator.delete), User.delete);

router.route('/administrators')
.post(validate(administratorValidator.create), Administrator.create);

router.route('/players')
.post(validate(playerValidator.create), Player.create);

router.route('/sessions')
.post(validate(sessionValidator.create), Session.create)
.delete(validate(sessionValidator.delete), Session.validate, Session.delete);

router.route('/companies')
.get(Company.readAll)
.post(validate(companyValidator.create), Company.create);

router.route('/companies/:company_id')
.get(validate(companyValidator.read), Company.read)
.patch(validate(companyValidator.update), Company.update)
.delete(validate(companyValidator.delete), Company.delete);

router.route('/assets')
.get(Asset.readAll);

router.route('/assets/:asset_id')
.get(validate(assetValidator.read), Asset.read)
.patch(validate(assetValidator.update), Asset.update)
.delete(validate(assetValidator.delete), Asset.delete);

router.route('/game_assets')
.post(validate(gameAssetValidator.create), GameAsset.create);

router.route('/campaigns')
.get(Campaign.readAll)
.post(validate(campaignValidator.create), Campaign.create);

router.route('/campaigns/:campaign_id')
.get(validate(campaignValidator.read), Campaign.read)
.patch(validate(campaignValidator.update), Campaign.update)
.delete(validate(campaignValidator.delete), Campaign.delete);

router.route('/companies/:company_id/campaign')
.get(validate(campaignValidator.readByCompany), Campaign.readByCompany);

router.route('/missions')
.get(Mission.readAll)
.post(validate(missionValidator.create), Mission.create);

router.route('/missions/:mission_id')
.get(validate(missionValidator.read), Mission.read)
.patch(validate(missionValidator.update), Mission.update)
.delete(validate(missionValidator.delete), Mission.delete);

router.route('/mission_campaigns')
.get(MissionCampaign.readAll)
.post(validate(missionCampaignValidator.create), MissionCampaign.create);

router.route('/mission_campaigns/:mission_campaign_id')
.get(validate(missionCampaignValidator.read), MissionCampaign.read)
.patch(validate(missionCampaignValidator.update), MissionCampaign.update)
.delete(validate(missionCampaignValidator.delete), MissionCampaign.delete);

router.route('/players/me/campaigns/:campaign_id/campaign_status')
.get(validate(campaignStatusValidator.readByMe), Session.validate, User.isPlayer,
CampaignStatus.readByMe);

router.route('/players/me/campaign_statuses/:campaign_status_id')
.patch(validate(campaignStatusValidator.updateByMe), Session.validate, User.isPlayer,
CampaignStatus.updateByMe);

router.route('/players/me/campaigns/:campaign_id/mission_statuses')
.get(validate(missionStatusValidator.readAllByMe), Session.validate, User.isPlayer,
MissionStatus.readAllByMe);

router.route('/players/me/mission_statuses/:mission_status_id')
.patch(validate(missionStatusValidator.updateByMe), Session.validate, User.isPlayer,
MissionStatus.updateByMe);

export default router;
