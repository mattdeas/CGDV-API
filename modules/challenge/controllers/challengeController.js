'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
    require('./challenge/challenge.add.controller'),
    require('./challenge/challenge.get.controller'),
    require('./challenge/challenge.modify.controller'),
    require('./challenge/challenge.delete.controller')
);
