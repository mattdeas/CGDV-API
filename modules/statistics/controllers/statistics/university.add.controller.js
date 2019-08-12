'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  pool = require(path.resolve('lib/db')),
  Boom = require(path.resolve('languages/en/errors')),
  async = require('async'),
  University = require(path.resolve('models/University'));

/**
 * Add University
 */
exports.universityAdd = function (req, res, next) {
	async.waterfall([
      checkUniversityExistsByName,
      addUniversity
    ], function(err) {
      next(err);
    });
   
    // Check name  is unique or not
    function checkUniversityExistsByName(callback) {
      University.checkUniversityExistsByName(req.body.name, function(err, results) {
        if (err) {
          callback(err);
        } else if (results.length) {
          return res.status(Boom.ALREADY_EXIST.statusCode).json(Boom.ALREADY_EXIST);
        } else {
          callback(null);
        }
      });
    }

    function addUniversity(callback) {
      University.addUniversity(req.body, function(err, results) {
        if (err) {
          next(err);
        } else {
          return res.json({ status: 1, message: 'Added successfully.', result: results });
        }
      });
    }
};
