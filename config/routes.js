'use strict';

/**
 * Module dependencies.
 */

const router = require('express').Router();

/**
 * Expose
 */

module.exports = router;

router.get('/', function (req, res) {
  res.send('Sup buddy!');
})
