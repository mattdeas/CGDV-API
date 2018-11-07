'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    Visual = require(path.resolve('models/Visual')),
    helper = require(path.resolve('common/helper')),
    Boom = require(path.resolve('languages/en/errors'));

/**
 * get visual list
 *
 *
 */
exports.common = function(req, res, next) {
    res.status(Boom.NOT_IMPLEMENTED.statusCode).json(Boom.NOT_IMPLEMENTED)
}
