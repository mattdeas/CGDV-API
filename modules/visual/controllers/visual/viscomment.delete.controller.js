'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors')),
  comment = require(path.resolve('models/Comment'));
/**
 * delete visual
 *
 *
 */
exports.deleteVisualComment = function (req, res, next) {  
  var commentid = req.params.id;
  comment.deleteVisualComment(commentid, function (err, results) {
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