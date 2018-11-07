'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Cms = require(path.resolve('models/Cms')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete News
 *
 *
 */
exports.deleteNews = function (req, res, next) {    
  Cms.deleteNews(req.params.id, function (err, results) {
    if (err) {      
      next(err);
    } else {    
      res.json({ status: 1, message: 'Successfully deleted.' });
    } 
  });
};