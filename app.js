'use strict';

/**
 * Module dependencies.
 */

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');

const config = require('./config/env');

//const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;
const app = express();

/**
 * Expose
 */

module.exports = app;

// Bootstrap models
//fs.readdirSync(models)
// .filter(file => ~file.search(/^[^\.].*\.js$/))
// .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/express')(app);

connect()
 .on('error', console.log)
 .on('disconnected', connect)
 .once('open', listen);

function listen () {
 if (app.get('env') === 'test') return;
 app.listen(port);
 console.log('TapNWin app started on port ' + port);
}

function connect () {
 var options = { server: { socketOptions: { keepAlive: 1 } } };
 return mongoose.connect(config.db, options).connection;
}
