'use strict';

const Company = require('../../controllers/common/company');
const Campaign = require('../../controllers/common/campaign');

const router = require('express').Router();
const user = require('../../controllers/common/user');

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
});

router.get('/users', user.readAll);

router.route('/companies')
.get(Company.readAll)
.post(Company.create);

router.route('/companies/:company_id')
.get(Company.read)
.patch(Company.update)
.delete(Company.delete);

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
