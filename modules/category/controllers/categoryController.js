'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./category/category.add.controller'),
  require('./category/category.modify.controller'),
  require('./category/category.get.controller'),
  require('./category/category.delete.controller'),
  require('./category/common.controller')
);