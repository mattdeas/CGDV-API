'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./country/country.add.controller'),
  require('./country/country.modify.controller'),
  require('./country/country.get.controller'),
  require('./country/country.delete.controller'),
  require('./country/common.controller')
);