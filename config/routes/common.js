'use strict';

const router = require('express').Router();
const Company = require('../../controllers/common/company');
const Campaign = require('../../controllers/common/campaign');
const Game = require('../../controllers/common/game');
const User = require('../../controllers/common/user');
const Session = require('../../controllers/common/session');
const Mission = require('../../controllers/common/mission');
const Status = require('../../controllers/common/status');

module.exports = router;

// Users

router.route('/sessions')
.post(Session.create)
.delete(Session.delete);

router.route('/users')
.get(User.readAll)
.post(User.create);

router.route('/users/:user_id')
.get(User.read)
.patch(User.update)
.delete(User.delete);

// Companies

router.route('/companies')
.get(Company.readAll)
.post(Company.create);

router.route('/companies/:company_id')
.get(Company.read)
.patch(Company.update)
.delete(Company.delete);

// Campaigns

router.route('/campaigns')
.get(Campaign.readAll);

router.route('/companies/:company_id/campaigns')
.all(Company.check)
.get(Campaign.readByACompany)
.post(Campaign.createByACompany);

router.route('/companies/:company_id/campaigns/:campaign_id')
.all(Company.check)
.get(Campaign.read)
.put(Campaign.update)
.delete(Campaign.delete);

// Games

router.route('/games')
.get(Game.readAll)
.post(Game.create);

router.route('/games/:game_id')
.get(Game.read)
.patch(Game.update)
.delete(Game.delete);

// Missions

router.route('/missions')
.get(Mission.readAll)
.post(Mission.create);

router.route('/missions/:mission_id')
.get(Mission.read)
.patch(Mission.update)
.delete(Mission.delete);

// Status

router.route('/statuses')
.get(Status.readAll)
.post(Status.create);

router.route('/statuses/:status_id')
.get(Status.read)
.patch(Status.update)
.delete(Status.delete);
