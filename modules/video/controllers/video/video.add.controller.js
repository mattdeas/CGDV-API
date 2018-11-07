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
  Video = require(path.resolve('models/Video'));
/**
 * Add Video
 */
exports.videoAdd = function (req, res, next) {
  Video.addVideo(req.body, function (err, results) {
    if (err) {
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });
}; // End 
