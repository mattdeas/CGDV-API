'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Video = require(path.resolve('models/Video')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete video
 *
 *
 */
exports.deleteVideo = function (req, res, next) {  
  var viz_id = req.params.id;
  Video.deleteVideo(viz_id, function (err, results) {
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