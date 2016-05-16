'use strict';

const router = require('express').Router();
const user = require('../../controllers/common/user');

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
});

router.get('/users', user.readAll);
