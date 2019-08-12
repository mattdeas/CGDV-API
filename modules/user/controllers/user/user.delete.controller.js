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
exports.deleteUser = function (req, res, next) {  
  var user_id = req.params.id;
 
  User.changeStatus(user_id, 0, function (err, results) {
    if (err) {
      if(err.detail.indexOf('is still referenced from')!== -1){        
        return res.status(Boom.STILL_REFERENCED.statusCode).json(Boom.STILL_REFERENCED);
      }
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });

};