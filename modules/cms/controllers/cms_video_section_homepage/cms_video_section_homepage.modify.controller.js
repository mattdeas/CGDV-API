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
  Cms = require(path.resolve('models/Cms'));

/**
 * updateHomepageVideoSection
 */
exports.updateHomepageVideoSection = function (req, res, next) {
  
  Cms.updateHomepageVideoSection(req.body, function(err, data) {
        if (err) {
          next(err);
        } else {
          return res.json({ status: 1, message: 'Updated successfully'});
        }
  });
};
