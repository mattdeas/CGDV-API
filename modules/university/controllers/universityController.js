'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./university/university.add.controller'),
  require('./university/university.modify.controller'),
  require('./university/university.get.controller'),
  require('./university/university.delete.controller'),
  require('./university/common.controller')
);