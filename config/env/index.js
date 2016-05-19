'use strict';

const path = require('path');

const development = require('./development');
const production = require('./production');

const defaults = {
  root: path.join(__dirname, '..'),
  limit(limit) {
    return !isNaN(limit) ? parseInt(limit, 10) : 20;
  },
  offset(offset) {
    return !isNaN(offset) ? parseInt(offset, 10) : 0;
  },
};

module.exports = {
  development: Object.assign(development, defaults),
  production: Object.assign(production, defaults),
}[process.env.NODE_ENV || 'development'];
