'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend parent's validations
 */
module.exports = _.extend(
  require('./country/country.add')
);