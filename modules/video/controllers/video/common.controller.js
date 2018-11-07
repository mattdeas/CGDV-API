'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
    Video = require(path.resolve('models/Video')),
    helper = require(path.resolve('common/helper')),
    Boom = require(path.resolve('languages/en/errors'));

/**
 * get visual list
 *
 *
 */
exports.deafault = function(req, res, next) {
    res.status(Boom.NOT_IMPLEMENTED.statusCode).json(Boom.NOT_IMPLEMENTED)
}
