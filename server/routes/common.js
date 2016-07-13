import express from 'express';
import Company from '../controllers/common/company';
import Campaign from '../controllers/common/campaign';
import User from '../controllers/common/user';
import Administrator from '../controllers/common/administrator';
import Player from '../controllers/common/player';
import Session from '../controllers/common/session';
import Mission from '../controllers/common/mission';
import MissionCampaign from '../controllers/common/mission_campaign';
import MissionStatus from '../controllers/common/mission_status';
import CampaignStatus from '../controllers/common/campaign_status';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/administrators')
.post(Administrator.create);

router.route('/administrators/:administrator_id')
.patch(Administrator.update);

router.route('/players')
.post(Player.create);

router.route('/players/:player_id')
.patch(Player.update);

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
.delete(User.delete);

router.route('/companies')
.get(Company.readAll)
.post(Company.create);

router.route('/companies/:company_id')
.get(Company.read)
.patch(Company.update)
.delete(Company.delete);

router.route('/campaigns')
.get(Campaign.readAll)
.post(Campaign.create);

router.route('/campaigns/:campaign_id')
.get(Campaign.read)
.put(Campaign.update)
.delete(Campaign.delete);

router.route('/missions')
.get(Mission.readAll)
.post(Mission.create);

router.route('/missions/:mission_id')
.get(Mission.read)
.patch(Mission.update)
.delete(Mission.delete);

router.route('/missions_campaigns')
.get(MissionCampaign.readAll)
.post(MissionCampaign.create);

router.route('/missions/:mission_campaign_id')
.get(MissionCampaign.read)
.patch(MissionCampaign.update)
.delete(MissionCampaign.delete);

router.route('/players/me/campaigns/:campaign_id/campaign_status')
.all(Session.validate, User.isPlayer, Campaign.validate)
.get(CampaignStatus.readByMe)
.patch(CampaignStatus.updateByMe);

router.route('/players/me/campaigns/:campaign_id/mission_statuses')
.all(Session.validate, User.isPlayer, Campaign.validate)
.get(MissionStatus.readAllByMe);

router.route('/players/me/mission_statuses/:mission_status_id')
.all(Session.validate, User.isPlayer)
.patch(MissionStatus.updateByMe);

export default router;
