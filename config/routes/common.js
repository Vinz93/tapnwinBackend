'use strict';

const Company = require('../../controllers/common/company');
const Campaign = require('../../controllers/common/campaign');
const Game = require('../../controllers/common/game');

const router = require('express').Router();

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
});

//Companies

router.route('/companies')
.get(Company.readAll)
.post(Company.create);

router.route('/companies/:company_id')
.get(Company.read)
.patch(Company.update)
.delete(Company.delete);

//Campaigns

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

//Games

router.route('/games')
.get(Game.readAll)
.post(Game.create);

router.route('/games/:game_id')
.get(Game.read)
.patch(Game.update)
.delete(Game.delete);
