'use strict';

/**
 * Module dependencies
 */

const path = require('path'),
  stratagy = require(path.resolve('modules/stratagy')),
  validate = require('../validate/commonValidate');




module.exports = function (app) {

  // Common Controller
  var common = require('../controllers/commonController');

  // Upload Images
  app.route('/api/common/upload')
    .post(
      stratagy.isAuthorized,
      validate.checkImage,
      common.upload
    );

  app.route('/api/common/removeImage')
    .post(
      stratagy.isAuthorized,
      validate.checkImage,
      common.removeImage
    );

};