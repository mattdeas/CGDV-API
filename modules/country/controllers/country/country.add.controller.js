'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  pool = require(path.resolve('lib/db')),
  Boom = require(path.resolve('languages/en/errors')),
  async = require('async'),
  Country = require(path.resolve('models/Country'));

/**
 * Add Country
 */
exports.countryAdd = function (req, res, next) {
	async.waterfall([
      checkCountryExists,
      addCountry
    ], function(err) {
      next(err);
    });
   
    // Check email is unique or not
    function checkCountryExists(callback) {
      Country.checkCountryExistsByName(req.body.name, function(err, results) {
        if (err) {
          callback(err);
        } else if (results.length) {
          return res.status(Boom.ALREADY_EXIST.statusCode).json(Boom.ALREADY_EXIST);
        } else {
          callback(null);
        }
      });
    }

    function addCountry(callback) {
      Country.addCountry(req.body, function(err, results) {
        if (err) {
          next(err);
        } else {
          return res.json({ status: 1, message: 'Added successfully.', result: results });
        }
      });
    }
};
