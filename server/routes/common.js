import express from 'express';
import validate from 'express-validation';

import paramValidation from '../../config/param_validation';
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
import MissionStatus from '../controllers/common/mission_status';
import CampaignStatus from '../controllers/common/campaign_status';

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.route('/administrators')
.post(Administrator.create);

router.route('/players')
.post(Player.create);

router.route('/users/recovery_token')
.post(User.createRecoveryToken);

router.route('/users/password')
.put(User.updatePassword);

router.route('/sessions')
.post(Session.create)
.delete(Session.validate, Session.delete);

router.route('/users')
.get(User.readAll);

router.route('/users/me')
.get(Session.validate, User.readByMe)
.patch(Session.validate, User.updateByMe);

router.route('/users/:user_id')
.get(User.read)
.patch(validate(paramValidation.updateUser), User.update)
.delete(User.delete);

router.route('/companies')
.get(Company.readAll)
.post(Company.create);

router.route('/companies/:company_id')
.get(Company.read)
.patch(Company.update)
.delete(Company.delete);

router.route('/assets')
.get(Asset.readAll);

router.route('/assets/:asset_id')
.get(Asset.read)
.patch(Asset.update)
.delete(Asset.delete);

router.route('/game_assets')
.post(GameAsset.create);

router.route('/campaigns')
.get(Campaign.readAll)
.post(Campaign.create);

router.route('/campaigns/:campaign_id')
.get(Campaign.read)
.patch(Campaign.update)
.delete(Campaign.delete);

router.route('/companies/:company_id/campaign')
.get(Campaign.readByCompany);

router.route('/missions')
.get(Mission.readAll)
.post(Mission.create);

router.route('/missions/:mission_id')
.get(Mission.read)
.patch(Mission.update)
.delete(Mission.delete);

router.route('/mission_campaigns')
.get(MissionCampaign.readAll)
.post(MissionCampaign.create);

router.route('/mission_campaigns/:mission_campaign_id')
.get(MissionCampaign.read)
.patch(MissionCampaign.update)
.delete(MissionCampaign.delete);

router.route('/players/me/campaigns/:campaign_id/campaign_status')
.all(Session.validate, User.isPlayer)
.get(CampaignStatus.readByMe);

router.route('/players/me/campaign_statuses/:campaign_status_id')
.all(Session.validate, User.isPlayer)
.patch(CampaignStatus.updateByMe);

router.route('/players/me/campaigns/:campaign_id/mission_statuses')
.all(Session.validate, User.isPlayer)
.get(MissionStatus.readAllByMe);

router.route('/players/me/mission_statuses/:mission_status_id')
.all(Session.validate, User.isPlayer)
.patch(MissionStatus.updateByMe);

export default router;
