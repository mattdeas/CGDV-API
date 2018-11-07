'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Country = require(path.resolve('models/Country')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));


exports.common = function (req, res, next) {  

  res.status(Boom.NOT_IMPLEMENTED.statusCode).json(Boom.NOT_IMPLEMENTED)

}; // End 
