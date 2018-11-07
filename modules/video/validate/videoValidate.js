'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend video's validations
 */
module.exports = _.extend(
  require('./video/video.add')
);