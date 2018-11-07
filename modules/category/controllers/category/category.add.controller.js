'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  pool = require(path.resolve('lib/db')),
  Boom = require(path.resolve('languages/en/errors')),
  async = require('async'),
  Category = require(path.resolve('models/Category'));

/**
 * Add Category
 */
exports.categoryAdd = function (req, res, next) {
	async.waterfall([
      checkCategoryExistsByNameNType,
      addCategory
    ], function(err) {
      next(err);
    });
   
    // Check name and type is unique or not
    function checkCategoryExistsByNameNType(callback) {
      Category.checkCategoryExistsByNameNType(req.body.name, req.body.type, function(err, results) {
        if (err) {
          callback(err);
        } else if (results.length) {
          return res.status(Boom.ALREADY_EXIST.statusCode).json(Boom.ALREADY_EXIST);
        } else {
          callback(null);
        }
      });
    }

    function addCategory(callback) {
      Category.addCategory(req.body, function(err, results) {
        if (err) {
          next(err);
        } else {
          return res.json({ status: 1, message: 'Added successfully.', result: results });
        }
      });
    }
};
