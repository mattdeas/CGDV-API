'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  config = require(path.resolve('config/config')),
  pool = require(path.resolve('lib/db')),
  helper = require(path.resolve('common/helper')),
  async = require('async'),  
  Boom = require(path.resolve('languages/en/errors')),
  User = require(path.resolve('models/User')),
  Visual = require(path.resolve('models/Challenge')),
  challenge = require(path.resolve('models/Challenge'));
/**
 * Add Visual
 */

exports.challengeAdd = function (req, res, next) {
  challenge.addChallenge(req.body, function (err, results) {
    if (err) {
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });
}; // End 
