'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const config = require('./config/env');
const port = process.env.PORT || 3000;
const app = express();

mongoose.Promise = Promise;

module.exports = app;

require('./config/express')(app);

function listen() {
  if (app.get('env') === 'test')
    return;

  app.listen(port);

  console.log(`App started on port ${port}`);
}

function connect() {
  const options = {
    server: {
      socketOptions: {
        keepAlive: 1,
      },
    },
  };

  return mongoose.connect(config.db, options).connection;
}

connect()
.on('error', console.log)
.on('disconnected', connect)
.once('open', listen);
