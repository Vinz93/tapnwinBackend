'use strict';

/**
 * Module dependencies
 */
const path = require('path');
const extend = require('util')._extend;

const development = require('./development');
const production = require('./production');

const defaults = {
  root: path.join(__dirname, '..')
};

/**
 * Expose
 */

module.exports = {
  development: extend(development, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
