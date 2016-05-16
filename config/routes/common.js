'use strict';

const router = require('express').Router();

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
});
