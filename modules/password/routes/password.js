'use strict';

/**
 * Module dependencies
 */
var validate = require('../validate/passwordValidate');
var path = require('path');
var stratagy = require(path.resolve('modules/stratagy'));


module.exports = function (app) {

  // Password Controller
  var password = require('../controllers/passwordController');

  // Admin or publisher can request forgot password with email
  app.route('/api/password/forgot')
    .post(
            validate.forgot,
            password.forgot
          );


  

  // Admin, Publisher or Parent can reset password By OTP or Token
  app.route('/api/password/reset')
    .post(
    				validate.reset,
            password.reset
          );

 
  // Admin can change all user's password
  app.route('/api/password/:type(admin)/change/:id(\\d+)')
    .post(
            stratagy.isAdmin,
            validate.change,
            password.change
          );

  // All user can change password itselt
  app.route('/api/password/change')
    .post(
            stratagy.isAuthorized,
            validate.change,
            password.change
          );

  app.route('/api/password/checkCurrentPassword')
    .post(
            stratagy.isAuthorized,
            password.checkCurrentPassword
          );

};

