'use strict';

// TODO: Global config file for default values/messages

/**
 * Module dependencies.
 */

// const fs = require('fs');
// const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const config = require('./config/env');

const port = process.env.PORT || 3000;
const app = express();

/**
 * Expose
 */

module.exports = app;

// Bootstrap routes
require('./config/express')(app);

function listen() {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log(`TapNWin app started on port ${port}`);
}

function connect() {
  const options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.db, options).connection;
}

connect()
 .on('error', console.log)
 .on('disconnected', connect)
 .once('open', listen);
