'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend auth's controller
 */
module.exports = _.extend(
  require('./auth/login'),
  require('./auth/socialSignIn'),
  require('./auth/register')
);