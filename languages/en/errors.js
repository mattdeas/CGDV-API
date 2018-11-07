'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./errors/auth'),
  require('./errors/register'),
  require('./errors/common'),
  require('./errors/password')  
);