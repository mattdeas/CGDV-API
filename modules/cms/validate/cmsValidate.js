'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend validations
 */
module.exports = _.extend(
  require('./cms_about/cms_about.modify'),
  require('./partners/partner.add'),
  require('./news/news.add'),
  require('./journey/journey.add'),
);