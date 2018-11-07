'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Category = require(path.resolve('models/Category')),
  helper = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

/**
 * delete Category
 *
 *
 */
exports.deleteCategory = function (req, res, next) {    
  Category.deleteCategory(req.params.id, function (err, results) {
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