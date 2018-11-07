'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend auth's controller
 */
module.exports = _.extend(
  require('./auth/loginController'),
  require('./auth/refreshTokenController'),
  require('./auth/logoutController'),
  require('./auth/register.controller'),
  require('./auth/socialSignIn.controller')
);