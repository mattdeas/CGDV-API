'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend controller
 */
module.exports = _.extend(
  require('./cms_about/cms_about.get.controller'),
  require('./cms_about/cms_about.add.controller'),
  require('./cms_about/cms_about.modify.controller'),

  require('./cms_video_section_homepage/cms_video_section_homepage.get.controller'),
  require('./cms_video_section_homepage/cms_video_section_homepage.add.controller'),
  require('./cms_video_section_homepage/cms_video_section_homepage.modify.controller'),

  require('./cms_journey/cms_journey.add.controller'),
  require('./cms_journey/cms_journey.delete.controller'),
  require('./cms_journey/cms_journey.get.controller'),
  require('./cms_journey/cms_journey.modify.controller'),

  require('./cms_news/cms_news.add.controller'),
  require('./cms_news/cms_news.delete.controller'),
  require('./cms_news/cms_news.get.controller'),
  require('./cms_news/cms_news.modify.controller'),
  
  require('./cms_partners/cms_partners.add.controller'),
  require('./cms_partners/cms_partners.delete.controller'),
  require('./cms_partners/cms_partners.get.controller'),
  require('./cms_partners/cms_partners.modify.controller'),

);