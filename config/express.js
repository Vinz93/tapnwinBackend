'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./env');
const routes = require('./routes');

module.exports = function (app) {

  app.use(express.static(config.root + '/public'));

  app.use('/api', bodyParser.json());
  app.use('/api', bodyParser.urlencoded({
    extended: true
  }));
  app.use('/api', routes);
  app.use('/api', cors());
  app.use('/api', morgan('dev'));
};
