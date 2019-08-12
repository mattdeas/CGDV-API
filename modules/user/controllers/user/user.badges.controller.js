'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  User = require(path.resolve('models/User')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete user
 *
 *
 */
exports.toggleTopBadge = function (req, res, next) {    
  User.setTopBadge(req.body, function (err, results) {
    if (err) {
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });

};