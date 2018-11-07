'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Country = require(path.resolve('models/Country')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete Country
 *
 *
 */
exports.deleteCountry = function (req, res, next) {    
  Country.deleteCountry(req.params.id, function (err, results) {
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