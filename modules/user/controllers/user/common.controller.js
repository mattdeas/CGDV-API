'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  User = require(path.resolve('models/User')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));


/**
 * getUserProfile
 *
 *
 */
exports.getUserProfile = function (req, res, next) {  
  var id = req.params.id ;
  User.getUserProfile(null, id, function (err, results) {
    console.log(err, results)
    if (err) {
      next(err);
    } else if (!results.length) {
      return res.status(Boom.NO_DATA_FOUND.statusCode).json(Boom.NO_DATA_FOUND);
    } else {
      res.json({ status: 1, message: 'Success', data: results });
    }
  });

}; 