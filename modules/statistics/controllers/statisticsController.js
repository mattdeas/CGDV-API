'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./statistics/statistics.get.controller'),
  require('./statistics/common.controller')
);