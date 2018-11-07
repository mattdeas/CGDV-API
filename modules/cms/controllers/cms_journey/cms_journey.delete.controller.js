'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Cms = require(path.resolve('models/Cms')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete Journey
 *
 *
 */
exports.deleteJourney = function (req, res, next) {    
  Cms.deleteJourney(req.params.id, function (err, results) {
    if (err) {      
      next(err);
    } else {    
      res.json({ status: 1, message: 'Success' });
    } 
  });
};