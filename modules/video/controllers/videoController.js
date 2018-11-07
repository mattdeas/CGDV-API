'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./video/video.add.controller'),
  require('./video/video.get.controller'),
  require('./video/video.modify.controller'),
  require('./video/video.delete.controller'),
  require('./video/common.controller')
);