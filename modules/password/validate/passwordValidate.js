'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend password's validators
 */
module.exports = _.extend(
  require('./password/forgot'),
  require('./password/reset'),
  require('./password/change')
);