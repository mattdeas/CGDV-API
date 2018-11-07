'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Visual = require(path.resolve('models/Visual')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete visual
 *
 *
 */
exports.deleteVisual = function (req, res, next) {  
  var viz_id = req.params.id;
  var user_id = req.query.user_id;
  if(!user_id){
    user_id = req.user.id;
  }
  Visual.deleteVisual(viz_id, user_id, function (err, results) {
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