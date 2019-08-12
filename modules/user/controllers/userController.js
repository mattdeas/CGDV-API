'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./user/user.register.controller'),
  require('./user/user.get.controller'),
  require('./user/user.update.controller'),
  require('./user/user.delete.controller'),
  require('./user/admin.register.controller'),
  require('./user/common.controller'),
  require('./user/user.team.controller'),
  require('./user/user.badges.controller'),
);