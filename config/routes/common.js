'use strict';

const Company = require('../../controllers/common/company');

const router = require('express').Router();

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
});

router.route('/companies')
.get(Company.readAll)
.post(Company.create);

router.route('/companies/:company_id')
.get(Company.read)
.patch(Company.update)
.delete(Company.delete);
