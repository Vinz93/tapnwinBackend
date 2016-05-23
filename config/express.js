'use strict';

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const config = require('./env');
const commonRoutes = require('./routes/common');
const designRoutes = require('./routes/design');

module.exports = function (app) {
  app.use(express.static(path.join(config.root, '/public')));
  app.use('/api/v1', morgan('dev'));

  app.use('/api', bodyParser.json());
  app.use('/api', bodyParser.urlencoded({
    extended: true,
  }));

  app.use('/api/v1', commonRoutes);
  app.use('/api/v1', designRoutes);
  app.use('/api/v1', cors());

  app.locals.config = config;
  app.locals.mailer = nodemailer.createTransport(config.mailer);
};
