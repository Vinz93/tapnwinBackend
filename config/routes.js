'use strict';

/**
 * Module dependencies.
 */

const router = require('express').Router();

/**
 * Controllers dependencies.
 */

const user = require('../controllers/shared/user');

/**
 * Expose
 */

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
});
