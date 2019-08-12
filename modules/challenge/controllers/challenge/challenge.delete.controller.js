'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Challenge = require(path.resolve('models/Challenge')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete visual
 *
 *
 */
exports.deleteChallenge = function (req, res, next) {  
  var challenge_id = req.params.id;
  var user_id = req.query.user_id;
  if(!user_id){
    user_id = req.user.id;
  }
  Challenge.deleteChallenge(challenge_id, 1, function (err, results) {
    if (err) {
      
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });
};