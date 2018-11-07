'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  pool = require(path.resolve('lib/db')),
  Boom = require(path.resolve('languages/en/errors')),
  async = require('async'),
  Cms = require(path.resolve('models/Cms'));

/**
 * Add Journey
 */
exports.addJourney = function (req, res, next) {
	Cms.addJourney(req.body, function(err, results) {
    if (err) {
      next(err);
    } else {
      return res.json({ status: 1, message: 'Added successfully.', result: results });
    }
  });   
};
