'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend password's controller
 */
module.exports = _.extend(
	require('./password/forgot.password.controller'),
 	require('./password/reset.password.controller'),
 	require('./password/change.password.controller'),
 	require('./password/check.current.password.controller')
);